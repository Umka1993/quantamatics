import React, { HTMLProps, useEffect, useState } from "react";
import style from "./style/user-account-detail.module.scss";
import { IUser } from "../../../types/user";
import { AppRoute, OrganizationKey, UserKey } from "../../../data/enum";
import classNames from "classnames";
import { useParams } from "react-router";
import { useGetUserQuery } from "../../../api/user";
import { useGetAllAssetsQuery, useGetUserAssetsQuery } from "../../../api/asset";
import moment from "moment";
import useToggle from "../../../hooks/useToggle";
import { UserAccountHeader } from "./user-account-header";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../breadcrumb/Breadcrumb";
import { useGetOrganizationQuery, useUpdateOrganizationMutation } from "../../../api/organization";
import { Organization } from "../../../types/organization/types";
import Loader from "../../loader";
import AssetModalWithoutPin from "./modal-assets";
import EditOrganizationUser from "../EditOrganizationUser";
import useBoolean from "../../../hooks/useBoolean";
import Dialog from "../../dialog";
import EditOrganizationUserForm from "./edit-organizationUser-without-assets";
import EditOrganizationUserWithoutAssets from "./edit-organizationUser-without-assets";

interface IEditUserAccountDetail extends HTMLProps<HTMLDivElement> {
	selectedUser: IUser | null;
	toggleAssetModal: () => void;
	toggleOrganizationModal: () => void;
}

export const ViewUserAccountPage = () => {
	const { id: orgId, userId } = useParams();

	const [selectedUser, setSelectedUser] = useState<IUser>();
	const { data: serverSelectedAssets, isSuccess: isAssetsLoaded } =
				useGetUserAssetsQuery(userId as string);

	const [selectedAssets, setSelectedAssets] = useState(serverSelectedAssets);
	const [usersOrganization, setUsersOrganization] = useState<Organization>();

	const [isEditUserPage, toggleEditUserPage] = useToggle(false);
	const [isAssetsOpened, toggleAssetsModal] = useToggle(false);

	const { data: user, isSuccess: isUserLoaded } = useGetUserQuery(
		userId as string
	);
	const [update, { isLoading: isUpdating }] = useUpdateOrganizationMutation();

	const { data: assets } = useGetAllAssetsQuery(orgId as string);


	const { data: company } = useGetOrganizationQuery(orgId as string);


	const expirationDate = moment(
		selectedUser && selectedUser[UserKey.SubscriptionEndDate]
	).format("MM/DD/yyyy");

	useEffect(() => {
		if (user && company) {
			setSelectedUser(user);
			setUsersOrganization(company);
		}
	}, [user, company]);

	useEffect(() => {
		if (usersOrganization && serverSelectedAssets) {
			setSelectedAssets(serverSelectedAssets);
		}
	}, [usersOrganization, serverSelectedAssets]);




	const {
		value: isUserCloseRequested,
		setTrue: requestUserClose,
		setFalse: setUserToDefault,
	} = useBoolean(false);

	if (!user) {
		return <Loader />;
	}

	if (selectedUser && selectedAssets && usersOrganization) {
		const selectedAssetsString = selectedAssets.map((asset) => {
			const arrAssets = [];
			arrAssets.push(asset.name);
			return arrAssets;
		});

		const roleString = selectedUser[UserKey.UserRoles].map((role) => {
			const arrAssets = [];
			arrAssets.push(role);
			return arrAssets;
		});

		const links = [
			{
				href: AppRoute.OrganizationList,
				text: "Organizations",
			},
			{
				href: `/organizations/${orgId}`,
				text: usersOrganization[OrganizationKey.Name],
			},
			{ text: `${selectedUser[UserKey.Name]} ${selectedUser[UserKey.Surname]}` },
		];

		return (
			<section className={classNames(style.root)}>
				<UserAccountHeader
					selectedUser={selectedUser}
					toggleEditUserPage={toggleEditUserPage}
					toggleAssetsModal={toggleAssetsModal}
				>
					{/*<Breadcrumb links={links} />*/}
				</UserAccountHeader>
				<div className={style.userData}>
					<div className={style.item}>
						<span className={style.itemName}>First Name</span>
						<span className={style.itemValue}>
							{selectedUser[UserKey.Name]}
						</span>
					</div>
					<div className={style.item}>
						<span className={style.itemName}>Last Name</span>
						<span className={style.itemValue}>
							{selectedUser[UserKey.Surname]}
						</span>
					</div>
					<div className={style.item}>
						<span className={style.itemName}>Email</span>
						<a
							className={`${style.itemValue} ${style.emailField}`}
							href={`mailto:${selectedUser[UserKey.Email]}`}
						>
							{selectedUser[UserKey.Email]}
						</a>
					</div>
					<div className={style.item}>
						<span className={style.itemName}>Expiration Date</span>
						<span className={style.itemValue}>{expirationDate}</span>
					</div>
					<div className={style.item}>
						<span className={style.itemName}>Organization</span>
						<span className={style.itemValue}>
							{selectedUser[UserKey.Company]}
						</span>
					</div>
					<div className={style.item}>
						<span className={style.itemName}>Organization Role</span>
						<span className={style.itemValue}>{roleString.join(", ")}</span>
					</div>

					<div className={style.item}>
						<span className={style.itemName}>Account Assets</span>
						<span className={style.itemValue}>
							{selectedAssetsString.join(", ")}
						</span>
					</div>
				</div>

				<Dialog
					open={isEditUserPage}
					onRequestClose={requestUserClose}
					closeOnOutsideClick
					id="org-user-modal"
					variant="right-side"
					hasCloseButton={false}
				>
					{isEditUserPage && (
						<EditOrganizationUserWithoutAssets
							user={selectedUser}
							isUserCloseRequested={isUserCloseRequested}
							setUserToDefault={setUserToDefault}
							toggleEditUserPage={toggleEditUserPage}
						/>
					)}
				</Dialog>

				<AssetModalWithoutPin
					open={isAssetsOpened}
					toggleAssetsModal={toggleAssetsModal}
					organization={usersOrganization}
					user={selectedUser}
				/>
			</section>
		);
	} else {
		return null;
	}
};
