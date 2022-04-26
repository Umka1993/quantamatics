import { useEffect, useMemo, useState } from "react";
import style from "./style/user-account-detail.module.scss";
import { IUser } from "../../../types/user";
import { AppRoute, OrganizationKey, UserKey } from "../../../data/enum";
import { useParams } from "react-router";
import {
	useGetOrganizationUsersQuery,
	useGetUserQuery,
} from "../../../api/user";

import useToggle from "../../../hooks/useToggle";
import { UserAccountHeader } from "./user-account-header";
import Breadcrumb from "../../breadcrumb/Breadcrumb";
import { useGetOrganizationQuery } from "../../../api/organization";
import { Organization } from "../../../types/organization/types";
import Loader from "../../loader";
import AssetModalWithoutPin from "./modal-assets";
import useBoolean from "../../../hooks/useBoolean";
import Dialog from "../../dialog";
import EditOrganizationUserWithoutAssets from "./edit-organizationUser-without-assets";
import useUser from "../../../hooks/useUser";
import { UsersList } from "../../users-list/users-list";
import UserInfo from "../../user-info/UserInfo";

export const ViewUserAccountPage = () => {
	const { id: orgId, userId } = useParams();
	const loggedInUser = useUser();

	const [selectedUser, setSelectedUser] = useState<IUser | null>(null);


	const [usersOrganization, setUsersOrganization] = useState<Organization>();

	const [isEditUserPage, toggleEditUserPage] = useToggle(false);
	const [isAssetsOpened, toggleAssetsModal] = useToggle(false);

	const { data: user, isFetching } = useGetUserQuery(userId as string);

	const { data: company } = useGetOrganizationQuery(orgId as string);

	const [organizationEmployee, setOrganizationEmployee] = useState(false);

	const [localRows, setLocalRows] = useState<IUser[]>([]);

	const hasAssets =
		usersOrganization && Boolean(usersOrganization.organizationAssets.length);

	const {
		data: userList,
		isSuccess: isUsersLoaded,
	} = useGetOrganizationUsersQuery(orgId as string);

	const endDates = useMemo(() => {
		if (isUsersLoaded && userList) {
			document.body.classList.remove('scroll-lock')
			const result = new Map<number, string>();

			userList.map((user) => {
				result.set(user.id, user.subscriptionEndDate.split(" ")[0]);
			});
			return result;
		}
	}, [isUsersLoaded, userList]);

	useEffect(() => {
		if (userList) {

			const filtered = userList.filter((user) => user.id !== Number(userId))
			sessionStorage.setItem("table-rows", JSON.stringify(filtered));
			setLocalRows(filtered);
		}
	}, [userList, userId]);

	useEffect(() => {
		if (user && company) {
			setSelectedUser(user);
			setUsersOrganization(company);
		}
	}, [user, company]);

	useEffect(() => {
		if (selectedUser && usersOrganization) {
			const organizationEmployee =
				selectedUser[UserKey.OrganizationId] ===
				usersOrganization[OrganizationKey.Id] &&
				loggedInUser[UserKey.OrganizationId] ===
				usersOrganization[OrganizationKey.Id];

			setOrganizationEmployee(organizationEmployee);
		}
	}, [selectedUser, usersOrganization]);


	const {
		value: isUserCloseRequested,
		setTrue: requestUserClose,
		setFalse: setUserToDefault,
	} = useBoolean(false);

	if (!user) {
		return <Loader />;
	}

	if (isFetching) {
		return <Loader />;
	}

	if (selectedUser && usersOrganization) {

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
				text: `${selectedUser[UserKey.Name]} ${selectedUser[UserKey.Surname]}`,
			},
		];

		const organizationEmployeeLinks = [
			{
				href: `/organizations/${orgId}`,
				text: usersOrganization[OrganizationKey.Name],
			},
			{
				text: `${selectedUser[UserKey.Name]} ${selectedUser[UserKey.Surname]}`,
			},
		];

		return (
			<section>
				<div className={style.root}>
					<UserAccountHeader
						selectedUser={selectedUser}
						toggleEditUserPage={toggleEditUserPage}
						toggleAssetsModal={toggleAssetsModal}
					>
						{organizationEmployee ? (
							<Breadcrumb links={organizationEmployeeLinks} />
						) : (
							<Breadcrumb links={links} />
						)}
					</UserAccountHeader>
					<UserInfo user={selectedUser} />
				</div>

				<UsersList
					endDates={endDates}
					hasAssets={hasAssets}
					localRows={localRows}
					setLocalRows={setLocalRows}
					headlineTitle="More User Accounts"
					organizationID={orgId}
				/>

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
	}
};
