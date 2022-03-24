import React, {
	FormEvent,
	useEffect,
	useRef,
	useState,
	FunctionComponent,
} from "react";

import Button, { ResetButton } from "../button";
import AppInput, { DatePick, Email, Multiselect } from "../app-input";
import { SelectorInput } from "../selector-input";

import { Error, OrganizationKey, UserRole } from "../../data/enum";
import { useDispatch } from "react-redux";
import { IUpdateUser, IUser } from "../../types/user";
import {
	useUpdateUserMutation,
	useUpdateUserRolesMutation,
} from "../../api/user";
import { useGetAllOrganizationsQuery } from "../../api/organization";
import IApiError from "../../types/api-error";
import useUser from "../../hooks/useUser";
import { login } from "../../store/authorization";
import Loader from "../loader";

import "./styles/edit-account.scss";
import { Organization } from "../../types/organization/types";
import {
	useGetAllAssetsQuery,
	useLazyGetUserAssetsQuery,
	useLinkAssetToUserMutation,
	useUnlinkAssetToUserMutation,
} from "../../api/asset";
import { useParams } from "react-router-dom";
import RoleSelector from "../role-selector";
import DatePickerComponent from "../app-input/new-datepick";
interface IEditProfile {
	onClose: () => void;
	user: IUser;
}

export const EditProfile: FunctionComponent<IEditProfile> = ({
	onClose,
	user,
}) => {
	const { id: organizationID } = useParams();
	const [firstName, setName] = useState("");
	const [lastName, setSurname] = useState("");
	const [companyName, setOrganization] = useState("");
	const [email, setEmail] = useState("");
	const [subscriptionEndDate, setExpiration] = useState<Date>(new Date());

	const [emailError, setEmailError] = useState<string | undefined>(undefined);
	const [validate, setValidate] = useState<boolean>(false);
	const [userRoles, setRoles] = useState<Set<UserRole>>(new Set());
	const dispatch = useDispatch();

	const formRef = useRef<HTMLFormElement>(null);

	const loggedUser = useUser();
	const isSuperAdmin = loggedUser?.userRoles.includes(UserRole.Admin);

	const [
		fetchUserAssets,
		{ data: serverSelectedAssets, isSuccess: isAssetsLoaded },
	] = useLazyGetUserAssetsQuery();

	const [update, { isSuccess, isError, error, isLoading }] =
		useUpdateUserMutation();
	const [updateRoles, { isSuccess: isFinish, isLoading: secondLoading }] =
		useUpdateUserRolesMutation();

	const { data: allOrganizations } = useGetAllOrganizationsQuery(undefined);

	const { data: assets } = useGetAllAssetsQuery(organizationID as string);
	const [linkAsset] = useLinkAssetToUserMutation();
	const [unlinkAsset] = useUnlinkAssetToUserMutation();

	const [assignedAssets, setAssignedAssets] = useState<Set<string | number>>(
		new Set()
	);

	const [assetError, setAssetError] = useState(false);
	const [assetPrepared, setAssetPrepared] = useState(false);

	function validateHandler() {
		let userChanged =
			firstName !== user.firstName ||
			lastName !== user.lastName ||
			companyName !== user.companyName ||
			subscriptionEndDate.toISOString() !==
			new Date(user.subscriptionEndDate).toISOString();

		const rolesAsArray = Array.from(userRoles);
		const rolesIsSame =
			rolesAsArray.length === user.userRoles.length &&
			rolesAsArray.every((value, index) => value === user.userRoles[index]);

		const newUserData: IUpdateUser = {
			...user,
			firstName,
			lastName,
			companyName,
			subscriptionEndDate,
			userRoles: rolesAsArray,
		};

		if (email !== user.email) {
			newUserData.newEmail = email;
			userChanged = true;
		}

		//* Update user in redux store
		if (user.id === loggedUser?.id) {
			const normalizedNewData = {
				...loggedUser,
				firstName,
				lastName,
				companyName,
				email,
				subscriptionEndDate: subscriptionEndDate.toLocaleDateString(),
				userRoles: rolesAsArray,
			};
			dispatch(login(normalizedNewData));
			localStorage.setItem("user", JSON.stringify(normalizedNewData));
		}

		updateAssets();

		function updateRolesAndClose() {
			updateRoles([user.id, rolesAsArray]).unwrap().then(onClose);
		}

		userChanged
			? update(newUserData)
				.unwrap()
				.then(rolesIsSame ? onClose : updateRolesAndClose)
			: !rolesIsSame && updateRolesAndClose();

		!userChanged && rolesIsSame && onClose();
	}

	function updateAssets() {
		// ? Link new assets to user
		assignedAssets.forEach((assetId) => {
			const alreadySelectedAsset = serverSelectedAssets?.find(
				(element) => element.id === assetId
			);

			if (alreadySelectedAsset === undefined) {
				linkAsset({
					assetId,
					userId: user.id,
				});
			}
		});

		// ? Unlink old assets from user
		serverSelectedAssets?.forEach((alreadySelectedAsset) => {
			!assignedAssets.has(alreadySelectedAsset.id) &&
				unlinkAsset({
					assetId: alreadySelectedAsset.id,
					userId: user.id,
				});
		});
	}

	useEffect(() => {
		if (user) {
			setName(user.firstName);
			setSurname(user.lastName);
			setOrganization(user.companyName);
			setEmail(user.email);
			setExpiration(new Date(user.subscriptionEndDate));
			setRoles(new Set(user.userRoles));
			fetchUserAssets(user.id);
		}
	}, [user]);

	useEffect(() => {
		if (serverSelectedAssets && assets) {
			const selectedAssets: Set<string | number> = new Set(
				serverSelectedAssets.map(({ id }) => id)
			);
			setAssignedAssets(selectedAssets);
			setAssetPrepared(true);
		}
	}, [serverSelectedAssets, assets]);

	const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		if (assignedAssets.size) {
			setValidate(true);
			const isValid = formRef.current?.reportValidity();
			isValid && validateHandler();
		} else {
			setAssetError(true);
		}
	};

	useEffect(() => {
		if (isError) {
			if ((error as IApiError).data?.includes(" already taken"))
				setEmailError(Error.DuplicateUser);
			else alert(JSON.stringify((error as any).data?.errors));
		}
	}, [isError]);

	useEffect(() => {
		emailError && setEmailError(undefined);
	}, [email]);

	useEffect(() => {
		emailError && formRef.current?.reportValidity();
	}, [emailError]);

	return isLoading || secondLoading ? (
		<Loader />
	) : (
		<>
			<form
				id="edit-account-form"
				action=""
				className="edit-account__form-account"
				onSubmit={handlerSubmit}
				noValidate={validate ? undefined : true}
				ref={formRef}
			>
				<AppInput
					externalSetter={setName}
					value={firstName}
					name="firstName"
					icon="edit"
					label="First Name"
					maxLength={100}
					required
				/>
				<AppInput
					externalSetter={setSurname}
					value={lastName}
					name="lastName"
					icon="edit"
					label="Last Name"
					maxLength={100}
					required
				/>

				<Email
					externalSetter={setEmail}
					value={email}
					error={emailError}
					icon="edit"
					label="Email"
					maxLength={100}
					required
				/>
                <DatePickerComponent
                    externalSetter={setExpiration}
                    valueAsDate={subscriptionEndDate}
                    required
                    label="Expiration Date"
                />
				{allOrganizations && (
					<SelectorInput
						options={
							allOrganizations?.map(
								(org: Organization) => org[OrganizationKey.Name]
							) as string[]
						}
						// valueSetter={setOrganizationId}
						optionSetter={setOrganization}
						// values={allOrganizations?.map(({id}) => id) as string[]}
						value={companyName}
						label="Organization"
						disabled
					/>
				)}

				{assets && assetPrepared && (
					<Multiselect
						options={assets}
						selected={assignedAssets}
						setSelected={setAssignedAssets}
						label="Account Assets"
						errorMessage="Select asset permissions to assign to the user account."
						showError={assetError}
						type="user"
						inputList={[
							...assets.filter(({ assetId }) => assignedAssets.has(assetId)),
						]
							.map(({ name }) => name)
							.join(", ")}
					/>
				)}
				<RoleSelector
					isSuperAdmin={isSuperAdmin}
					defaultRoles={userRoles}
					externalSetter={setRoles}
				/>
			</form>

			<footer className="edit-account__footer">
				<ResetButton onClick={onClose}>Cancel</ResetButton>
				<Button type="submit" form="edit-account-form">
					Save
				</Button>
			</footer>
		</>
	);
};
