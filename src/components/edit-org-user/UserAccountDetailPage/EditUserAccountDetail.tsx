import React, { FormEvent, HTMLProps, useEffect, useState } from "react";
import style from "./style/user-account-detail.module.scss";
import { IUpdateUser, IUser } from "../../../types/user";
import { AppRoute, OrganizationKey, UserKey } from "../../../data/enum";
import classNames from "classnames";
import { useParams } from "react-router";
import { useGetOrganizationUsersQuery, useGetUserQuery } from "../../../api/user";
import {
	useGetAllAssetsQuery,
	useGetUserAssetsQuery,
} from "../../../api/asset";
import { AssetInOrganization, AssetServerResponse } from "../../../types/asset";
import useToggle from "../../../hooks/useToggle";
import { UserAccountHeader } from "./user-account-header";
import { useNavigate } from "react-router-dom";
import EditOrganizationUserForm from "./user-account-detail-form";
import { Organization } from "../../../types/organization/types";
import {
	useGetOrganizationQuery,
	useUpdateOrganizationMutation,
} from "../../../api/organization";
import Breadcrumb from "../../breadcrumb/Breadcrumb";
import useBoolean from "../../../hooks/useBoolean";
import AssetModalWithoutPin from "./modal-assets";
import Loader from "../../loader";
import Headline from "../../page-title";
import Button from "../../button";
import { ReactComponent as DocIcon } from "../../organization-info/assets/doc.svg";
import SaveResetHeader from "../../save-reset-header/SaveResetHeader";
import { login } from "../../../store/authorization";

export const EditUserAccountDetail = () => {
	const { id: orgId, userId } = useParams();

	const [selectedUser, setSelectedUser] = useState<IUser>();
	const [selectedAssets, setSelectedAssets] = useState<
		AssetInOrganization[] | undefined
	>();
	const [usersOrganization, setUsersOrganization] = useState<Organization>();

	const [isEditUserPage, toggleEditUserPage] = useToggle(false);
	const [isAssetsOpened, toggleAssetsModal] = useToggle(false);


	const { data: user, isSuccess: isUserLoaded } = useGetUserQuery(
		userId as string
	);
	const { data: assets } = useGetAllAssetsQuery(orgId as string);

	const { data: serverSelectedAssets, isSuccess: isAssetsLoaded } =
		useGetUserAssetsQuery(userId as string);

	const { data: company } = useGetOrganizationQuery(orgId as string);

	const navigate = useNavigate();
	const [update, { isLoading: isUpdating }] = useUpdateOrganizationMutation();
	const [hasChanges, setHasChanges] = useState(false);
	const [noAssetError, setNoAssetError] = useState(false);
	const [hasError, setError] = useState(false);
	const [isUserChanged, setUserChanged] = useState(false);




	useEffect(() => {
		if (usersOrganization && selectedAssets) {
			const isQuickChanged =
				usersOrganization.organizationAssets.length !== selectedAssets.length;

			if (isQuickChanged) {
				setHasChanges(true);
			} else {
				let isSharedChanged = false;
				selectedAssets.forEach((asset) => {
					const foundedInitialAsset = usersOrganization.organizationAssets.find(
						(initialAsset) => initialAsset.assetId === asset.assetId
					);

					if (foundedInitialAsset === undefined) {
						isSharedChanged = true;
					}
				});
				setHasChanges(isSharedChanged);
			}
		}
	}, [selectedAssets, usersOrganization]);

	// function submitHandler(evt: FormEvent<HTMLFormElement>) {
	// 	evt.preventDefault();
	//
	// 	const newUserData: IUpdateUser = {
	// 		...user,
	// 		firstName,
	// 		lastName,
	// 		companyName,
	// 		subscriptionEndDate,
	// 		userRoles: rolesAsArray,
	// 	};
	// 	if (selectedAssets && !selectedAssets.length) {
	// 		setError(true);
	// 		return setNoAssetError(true);
	// 	}
	//
	// 	if (usersOrganization) {
	// 		update({
	// 			...usersOrganization,
	// 			// organizationAssets: [...selectedAssets].map((asset) => ({
	// 			// 	...asset,
	// 			// 	asset: null,
	// 			// })),
	// 		})
	// 			.unwrap()
	// 			.then(closeFunction);
	// 	}
	// }

	useEffect(() => {
		if (user) {
			setSelectedUser(user);
			setUsersOrganization(company);
		}
	}, [user, serverSelectedAssets, company]);

	useEffect(() => {
		if (usersOrganization) {
			setSelectedAssets(usersOrganization[UserKey.OrganizationAssets]);
		}
	}, [usersOrganization]);

	if (isEditUserPage && selectedUser) {
		navigate(`/organizations/${orgId}/user/${selectedUser[UserKey.Id]}/edit`);
	}
	const closeFunction = () => {
		toggleAssetsModal();
	};

	const {
		value: isUserCloseRequested,
		setTrue: requestUserClose,
		setFalse: setUserToDefault,
	} = useBoolean(false);

	if (!selectedUser) {
		return <Loader />;
	}
	if (selectedUser && selectedAssets && !isEditUserPage && usersOrganization) {
		const links = [
			{
				href: AppRoute.OrganizationList,
				text: "Organizations",
			},
			{
				href: `/organizations/${orgId}`,
				text: usersOrganization[OrganizationKey.Name],
			},
			{
				href: `/organizations/${orgId}/user/${selectedUser[UserKey.Id]}/view`,
				text: `${selectedUser[UserKey.Name]}'s Account`,
			},
			{ text: "Edit Account" },
		];
		return (
			<section className={classNames(style.root)}>
				{/*<EditOrganizationUserForm*/}
				{/*	user={selectedUser}*/}
				{/*	isUserCloseRequested={isUserCloseRequested}*/}
				{/*	setUserToDefault={setUserToDefault}*/}
				{/*	isUserCloseRequested={isUserCloseRequested}*/}
				{/*/>*/}


				<AssetModalWithoutPin
					open={isAssetsOpened}
					closeFunction={closeFunction}
					organization={usersOrganization}
				/>
			</section>
		);
	} else {
		return null;
	}
};
