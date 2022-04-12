import React, { HTMLProps, useEffect, useState } from "react";
import style from "./style/user-account-detail.module.scss";
import { IUser } from "../../../types/user";
import { AppRoute, OrganizationKey, UserKey } from "../../../data/enum";
import classNames from "classnames";
import { useParams } from "react-router";
import { useGetUserQuery } from "../../../api/user";
import {
	useGetAllAssetsQuery,
	useGetUserAssetsQuery,
} from "../../../api/asset";
import { AssetServerResponse } from "../../../types/asset";
import useToggle from "../../../hooks/useToggle";
import { UserAccountHeader } from "./user-account-header";
import { useNavigate } from "react-router-dom";
import EditOrganizationUserForm from "./user-account-detail-form";
import { Organization } from "../../../types/organization/types";
import { useGetOrganizationQuery } from "../../../api/organization";
import Breadcrumb from "../../breadcrumb/Breadcrumb";
import useBoolean from "../../../hooks/useBoolean";
import AssetModalWithoutPin from "./modal-assets";
import Loader from "../../loader";

interface IEditUserAccountDetail extends HTMLProps<HTMLDivElement> {
	selectedUser: IUser | null;
	toggleAssetModal: () => void;
	toggleOrganizationModal: () => void;
}

export const EditUserAccountDetail = () => {
	const { id: orgId, userId } = useParams();

	const [selectedUser, setSelectedUser] = useState<IUser>();
	const [selectedAssets, setSelectedAssets] = useState<
		AssetServerResponse[] | undefined
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

	useEffect(() => {
		if (user) {
			setSelectedUser(user);
			setSelectedAssets(serverSelectedAssets);
			setUsersOrganization(company);
		}
	}, [user, serverSelectedAssets, company]);

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
				text: "Organisations",
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
				<UserAccountHeader
					selectedUser={selectedUser}
					toggleEditUserPage={toggleEditUserPage}
					toggleAssetsModal={toggleAssetsModal}
				>
					<Breadcrumb links={links} />
				</UserAccountHeader>

				<EditOrganizationUserForm
					user={selectedUser}
					// onClose={() => console.log("close")}
					isUserCloseRequested={isUserCloseRequested}
					setUserToDefault={setUserToDefault}
				/>

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
