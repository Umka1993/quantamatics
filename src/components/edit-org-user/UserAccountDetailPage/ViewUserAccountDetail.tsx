import React, { HTMLProps, useEffect, useState } from "react";
import style from "./style/user-account-detail.module.scss";
import { IUser } from "../../../types/user";
import { AppRoute, OrganizationKey, UserKey } from "../../../data/enum";
import classNames from "classnames";
import { useParams } from "react-router";
import { useGetUserQuery } from "../../../api/user";
import { useGetAllAssetsQuery } from "../../../api/asset";
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
import EditOrganizationUserForm from "./user-account-detail-form";
import EditOrganizationUserWithoutAssets from "./user-account-detail-form";

interface IEditUserAccountDetail extends HTMLProps<HTMLDivElement> {
	selectedUser: IUser | null;
	toggleAssetModal: () => void;
	toggleOrganizationModal: () => void;
}

export const ViewUserAccountDetail = () => {
	const { id: orgId, userId } = useParams();

	const [selectedUser, setSelectedUser] = useState<IUser>();
	const [selectedAssets, setSelectedAssets] = useState<
		IUser[UserKey.OrganizationAssets] | undefined
	>();
	const [usersOrganization, setUsersOrganization] = useState<Organization>();

	const [isEditUserPage, toggleEditUserPage] = useToggle(false);
	const [isAssetsOpened, toggleAssetsModal] = useToggle(false);

	const { data: user, isSuccess: isUserLoaded } = useGetUserQuery(
		userId as string
	);
	const [update, { isLoading: isUpdating }] = useUpdateOrganizationMutation();

	const { data: assets } = useGetAllAssetsQuery(orgId as string);
	// const { data: serverSelectedAssets, isSuccess: isAssetsLoaded } =
	// 	useGetUserAssetsQuery(userId as string);

	const { data: company } = useGetOrganizationQuery(orgId as string);

	const navigate = useNavigate();

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
		if (usersOrganization) {
			setSelectedAssets(usersOrganization[UserKey.OrganizationAssets]);
		}
	}, [usersOrganization]);

	// if (isEditUserPage && selectedUser) {
	// 	navigate(`/organizations/${orgId}/user/${selectedUser[UserKey.Id]}/edit`);
	// }

	const closeFunction = () => {
		toggleAssetsModal();
	};

	const closeModal = () => toggleEditUserPage();

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
			arrAssets.push(asset.asset.name);
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
					<Breadcrumb links={links} />
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
							className={style.itemValue}
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
							onClose={closeModal}
							isUserCloseRequested={isUserCloseRequested}
							setUserToDefault={setUserToDefault}
						/>
					)}
				</Dialog>


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
