import React, { FormEvent, useEffect, useRef, useState } from "react";

import Headline from "../../page-title";

import Button, { ResetButton } from "../../button";
import Input, { DatePick, Email, Multiselect } from "../../app-input";

import { Error, UserRole } from "../../../data/enum";
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

import style from ".././edit-org-user.module.scss";
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


interface Props {
	user: IUser;
	setUserToDefault: () => void;
	isUserCloseRequested: boolean;
	toggleEditUserPage: () => void;
}

export default function EditOrganizationUserWithoutAssets({
	user,
	setUserToDefault,
	isUserCloseRequested,
	toggleEditUserPage,
}: Props) {
	const { id: organizationID } = useParams();
	const [firstName, setName] = useState(user.firstName);
	const [lastName, setSurname] = useState(user.lastName);
	const [companyName, setOrganization] = useState(user.companyName);
	const [email, setEmail] = useState(user.email);
	const [subscriptionEndDate, setExpiration] = useState<Date>(
		new Date(user.subscriptionEndDate)
	);

	const [emailError, setEmailError] = useState<string | undefined>(undefined);
	const [validate, setValidate] = useState<boolean>(false);
	const [userRoles, setRoles] = useState<Set<UserRole>>(
		new Set(user.userRoles)
	);
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

	const { data: assets } = useGetAllAssetsQuery(organizationID as string);
	const [linkAsset, { isLoading: isAssetLinking }] =
		useLinkAssetToUserMutation();
	const [unlinkAsset, { isLoading: isAssetUnLinking }] =
		useUnlinkAssetToUserMutation();

	const [assignedAssets, setAssignedAssets] = useState<Set<string | number>>(
		new Set()
	);

	const [assetError, setAssetError] = useState(false);
	const [assetPrepared, setAssetPrepared] = useState(false);

	const [isUserChanged, setUserChanged] = useState(false);
	const [isRoleChanged, setRoleChanged] = useState(false);
	const [isAssetChanged, setAssetChanged] = useState(false);
	const [showError, setShowError] = useState(false);
	const [anyError, setAnyError]= useState(false)

	function validateHandler() {
		let userChanged = isUserChanged;

		const rolesAsArray = Array.from(userRoles);

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

		isAssetChanged && updateAssets();

		isAssetChanged && !userChanged && !isRoleChanged && toggleEditUserPage();

		function updateRolesAndClose() {
			updateRoles([user.id, rolesAsArray]).unwrap().then(toggleEditUserPage);
		}

		userChanged
			? update(newUserData)
				.unwrap()
				.then(!isRoleChanged ? toggleEditUserPage : updateRolesAndClose)
			: isRoleChanged && updateRolesAndClose();
	}

	useEffect(() => {
		const isMainDataChanged =
			firstName !== user.firstName ||
			lastName !== user.lastName ||
			companyName !== user.companyName ||
			email !== user.email;

		const inSubScriptionDateChanged =
			subscriptionEndDate.toISOString() !==
			new Date(user.subscriptionEndDate).toISOString();

		setUserChanged(isMainDataChanged || inSubScriptionDateChanged);
	}, [firstName, lastName, companyName, userRoles, subscriptionEndDate, email]);

	function checkIfAssetChanged() {
		let changed = false;

		serverSelectedAssets?.forEach((asset) => {
			if (!assignedAssets.has(asset.id)) {
				changed = true;
			}
		});

		!changed &&
			assignedAssets.forEach((assetId) => {
				const hasAsset = serverSelectedAssets?.findIndex((serverAsset) => {
					serverAsset.id === assetId;
				});

				if (hasAsset === -1) {
					return true;
				}
			});

		return changed;
	}

	useEffect(() => {
		if (serverSelectedAssets) {
			const isSameAmount = assignedAssets.size === serverSelectedAssets.length;
			setAssetChanged(!isSameAmount || (isSameAmount && checkIfAssetChanged()));
		}
	}, [assignedAssets, serverSelectedAssets, isAssetChanged]);

	useEffect(() => {
		const rolesIsSame =
			userRoles.size === user.userRoles.length &&
			user.userRoles.every((value) => userRoles.has(value));

		setRoleChanged(!rolesIsSame);
	}, [userRoles]);

	useEffect(() => {
		if (isUserCloseRequested) {
			setUserToDefault();

			if (isUserChanged || isRoleChanged || isAssetChanged) {
				if (showError) {
					setShowError(false);
					return toggleEditUserPage();
				} else setShowError(true);
			} else toggleEditUserPage();
		}
	}, [isUserCloseRequested, isUserChanged, isRoleChanged, isAssetChanged]);

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

	console.log('anyError',anyError)
	return (
		<form
			id="edit-account-form"
			action=""
			className={style.root}
			onSubmit={handlerSubmit}
			onReset={toggleEditUserPage}
			noValidate={validate ? undefined : true}
			ref={formRef}
		>
			<SaveResetHeader
				title={`Edit User Account`}
				headline={
					<>
						Edit User Account <span className={style.title}></span>{" "}
					</>
				}
				disableReset={isLoading || secondLoading}
				disableSave={
					!isUserChanged && !isRoleChanged && !isAssetChanged || isLoading || secondLoading || anyError
				}
				isSavedMessageActive={isLoading || secondLoading}
				headlineID="org-modal-title"
				className={style.header}
			/>

			{showError && (
				<p className={style.warning}>Changes have not been saved.</p>
			)}

			<div className={style.columns}>
				<Input
					externalSetter={setName}
					value={firstName}
					name="firstName"
					label="First Name"
					maxLength={100}
					required
					variant="squared"
					className={style.input}
				/>

				<Input
					externalSetter={setSurname}
					value={lastName}
					name="lastName"
					label="Last Name"
					maxLength={100}
					required
					variant="squared"
					className={style.input}
				/>
			</div>

			<Email
				externalSetter={setEmail}
				value={email}
				setAnyError={setAnyError}
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
				subscriptionDate={subscriptionEndDate}
				setSubscriptionDate={setExpiration}
			/>

			<Input
				externalSetter={setOrganization}
				value={companyName}
				name="companyName"
				label="Organization"
				maxLength={100}
				disabled
				required
				variant="squared"
				className={style.input}
			/>

			<RoleSelector
				isSuperAdmin={isSuperAdmin}
				defaultRoles={userRoles}
				externalSetter={setRoles}
				variant="squared"
				className={style.input}
			/>
		</form>
	);
}
