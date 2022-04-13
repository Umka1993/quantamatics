import React, { FormEvent, useEffect, useRef, useState } from "react";

import Headline from "../../page-title";
import Input, { Email } from "../../app-input";

import { Error, UserKey, UserRole } from "../../../data/enum";
import { useDispatch } from "react-redux";
import { IUpdateUser, IUser } from "../../../types/user";
import {
	useUpdateUserMutation,
	useUpdateUserRolesMutation,
} from "../../../api/user";
import IApiError from "../../../types/api-error";
import useUser from "../../../hooks/useUser";
import { login } from "../../../store/authorization";
import Loader from "../../loader";

import style from "./style/user-account-detail.module.scss";
import {
	useGetAllAssetsQuery,
	useGetUserAssetsQuery,
	useLinkAssetToUserMutation,
	useUnlinkAssetToUserMutation,
} from "../../../api/asset";
import { useParams } from "react-router-dom";
import RoleSelector from "../../role-selector";
import DatePickerComponent from "../../app-input/new-datepick";
import SaveResetHeader from "../../save-reset-header/SaveResetHeader";
import Breadcrumb, { BreadcrumbLink } from "../../breadcrumb/Breadcrumb";

interface Props {
	user: IUser;
	setUserToDefault: () => void;
	isUserCloseRequested: boolean;
	links: BreadcrumbLink[];
	selectedUser: IUser;
	isUpdating: boolean;
}

export default function EditOrganizationUserForm({
	user,
	links,
	selectedUser,
	isUpdating,
}: Props) {
	const { id: orgId, userId } = useParams();

	const [firstName, setName] = useState(user.firstName);
	const [lastName, setSurname] = useState(user.lastName);
	const [companyName, setOrganization] = useState(user.companyName);
	const [email, setEmail] = useState(user.email);
	const [subscriptionEndDate, setExpiration] = useState<Date>(
		new Date(user.subscriptionEndDate)
	);
	const [selectedSubscriptionEndDate, setSelectedSubscriptionEndDate]=useState(subscriptionEndDate)

	const [emailError, setEmailError] = useState<string | undefined>(undefined);
	const [validate, setValidate] = useState<boolean>(false);
	const [userRoles, setRoles] = useState<Set<UserRole>>(
		new Set(user.userRoles)
	);
	const [isUserChanged, setUserChanged] = useState(false);

	const dispatch = useDispatch();

	const formRef = useRef<HTMLFormElement>(null);

	const loggedUser = useUser();
	const isSuperAdmin = loggedUser?.userRoles.includes(UserRole.Admin);

	const { data: serverSelectedAssets, isSuccess: isAssetsLoaded } =
		useGetUserAssetsQuery(user.id);

	const [update, { isSuccess, isError, error, isLoading }] =
		useUpdateUserMutation();
	const [updateRoles, { isSuccess: isFinish, isLoading: secondLoading }] =
		useUpdateUserRolesMutation();

	const { data: assets } = useGetAllAssetsQuery(orgId as string);

	const [linkAsset, { isLoading: isAssetLinking }] =
		useLinkAssetToUserMutation();

	const [unlinkAsset, { isLoading: isAssetUnLinking }] =
		useUnlinkAssetToUserMutation();

	const [assignedAssets, setAssignedAssets] = useState<Set<string | number>>(
		new Set()
	);

	const [assetError, setAssetError] = useState(false);
	const [assetPrepared, setAssetPrepared] = useState(false);

	const [isRoleChanged, setRoleChanged] = useState(false);
	const [isAssetChanged, setAssetChanged] = useState(false);
	const [showError, setShowError] = useState(false);

	const [isCancel, setCancel] = useState<boolean>(false)

	useEffect( ()=>{

		if(isCancel){
			setName(user.firstName)
			setSurname(user.lastName)
			setOrganization(user.companyName)
			setEmail(user.email)
			setSelectedSubscriptionEndDate(new Date(user.subscriptionEndDate))
			setRoles(new Set(user.userRoles))
		}
		setCancel(false)
		setUserChanged(false)

	},[isCancel])


	useEffect(() => {
		const isMainDataChanged =
			firstName !== user.firstName ||
			lastName !== user.lastName ||
			companyName !== user.companyName ||
			email !== user.email;

		const inSubScriptionDateChanged =
				selectedSubscriptionEndDate.toISOString() !==
			new Date(user.subscriptionEndDate).toISOString();

		setUserChanged(
			isMainDataChanged || inSubScriptionDateChanged || isRoleChanged
		);
	}, [
		firstName,
		lastName,
		companyName,
		userRoles,
		isRoleChanged,
		selectedSubscriptionEndDate,
		email,
	]);

	// function checkIfAssetChanged() {
	// 	let changed = false;
	//
	// 	serverSelectedAssets?.forEach((asset) => {
	// 		if (!assignedAssets.has(asset.id)) {
	// 			changed = true;
	// 		}
	// 	});
	//
	// 	!changed &&
	// 		assignedAssets.forEach((assetId) => {
	// 			const hasAsset = serverSelectedAssets?.findIndex((serverAsset) => {
	// 				serverAsset.id === assetId;
	// 			});
	//
	// 			if (hasAsset === -1) {
	// 				return true;
	// 			}
	// 		});
	//
	// 	return changed;
	// }

	// useEffect(() => {
	// 	if (serverSelectedAssets) {
	// 		const isSameAmount = assignedAssets.size === serverSelectedAssets.length;
	// 		setAssetChanged(!isSameAmount || (isSameAmount && checkIfAssetChanged()));
	// 	}
	// }, [assignedAssets, serverSelectedAssets, isAssetChanged]);

	useEffect(() => {
		const rolesIsSame =
			userRoles.size === user.userRoles.length &&
			user.userRoles.every((value) => userRoles.has(value));

		setRoleChanged(!rolesIsSame);
	}, [userRoles]);

	useEffect(() => {
		if (serverSelectedAssets && assets) {
			const selectedAssets: Set<string | number> = new Set(
				serverSelectedAssets.map(({ id }) => id)
			);
			setAssignedAssets(selectedAssets);
			setAssetPrepared(true);
		}
	}, [serverSelectedAssets, assets]);

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

	const rolesAsArray = Array.from(userRoles);

	function submitHandler(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const newUserData: IUpdateUser = {
			...user,
			firstName,
			lastName,
			companyName,
			[UserKey.SubscriptionEndDate]: selectedSubscriptionEndDate,
			userRoles: rolesAsArray,
		};

		if (email !== user.email) {
			newUserData.newEmail = email;
			setUserChanged(true);
		}

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

		function updateAllRoles() {
			updateRoles([user.id, rolesAsArray]).unwrap();
		}

		isUserChanged && update(newUserData).unwrap().then(updateAllRoles);
	}

	useEffect(() => {
		setUserChanged(false);
	}, [isSuccess]);

	return isLoading || secondLoading || isAssetLinking || isAssetUnLinking ? (
		<Loader />
	) : (
		<>
			<form
				id="edit-user-account-form"
				action="src/components/edit-org-user/UserAccountDetailPage/user-account-detail-form"
				className={style.form}
				onSubmit={submitHandler}
				// onReset={setCancel}
				noValidate={validate ? undefined : true}
				ref={formRef}
			>
				<div className={style.headlineWrap}>
					<div className={style.headlineWrap__title}>
						<Breadcrumb links={links} />
						<Headline
							className={style.title}
							pageTitle={`User ${selectedUser[UserKey.Name]}`}
						>
							<span className={style.name}>{`${
								selectedUser[UserKey.Name]
							}'s`}</span>{" "}
							Account
						</Headline>
					</div>

					<div className={style.headlineWrap__buttons}>
						<SaveResetHeader
							headline=""
							disableReset={isUpdating}
							disableSave={!isUserChanged}
							isSavedMessageActive={isUpdating}
							headlineID="edit-user-account-form"
							className={style.header}
							setCancel={setCancel}
						/>
					</div>
				</div>

				<Input
					externalSetter={setName}
					value={firstName}
					name="firstName"
					label="First Name"
					maxLength={100}
					required
					variant="squared"
					className={style.input}
					// icon={<SpriteIcon icon="pen" width={16} />}
				/>

				<Input
					externalSetter={setSurname}
					value={lastName}
					name="lastName"
					// icon={<SpriteIcon icon="pen" width={16} />}
					label="Last Name"
					maxLength={100}
					required
					variant="squared"
					className={style.input}
				/>
				{/*</div>*/}

				<Email
					externalSetter={setEmail}
					value={email}
					error={emailError}
					label="Email"
					maxLength={100}
					required
					variant="squared"
					className={style.input}
				/>
				<DatePickerComponent
					minDate={new Date()}
					required
					label="Expiration Date"
					variant="squared"
					className={style.input}
					subscriptionDate={selectedSubscriptionEndDate}
					setSubscriptionDate={setSelectedSubscriptionEndDate}
					isCancel={isCancel}
				/>

				<Input
					externalSetter={setOrganization}
					value={companyName}
					name="companyName"
					label="Organization"
					maxLength={100}
					required
					variant="squared"
					className={style.input}
					disabled={true}
				/>

				<RoleSelector
					isSuperAdmin={isSuperAdmin}
					defaultRoles={userRoles}
					externalSetter={setRoles}
					variant="squared"
					className={style.input}
				/>
			</form>
		</>
	);
}
