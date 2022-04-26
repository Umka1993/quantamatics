import { useEffect, useMemo, useState } from "react";
import style from "./style/user-account-detail.module.scss";
import { IUser } from "../../../types/user";
import { AppRoute, UserKey } from "../../../data/enum";
import { useParams } from "react-router";
import {
	useGetOrganizationUsersQuery,
	useGetUserQuery,
} from "../../../api/user";

import useToggle from "../../../hooks/useToggle";
import { UserAccountHeader } from "./user-account-header";
import Breadcrumb, { BreadcrumbLink } from "../../breadcrumb/Breadcrumb";
import { useGetOrganizationQuery } from "../../../api/organization";
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

	const [isEditUserPage, toggleEditUserPage] = useToggle(false);
	const [isAssetsOpened, toggleAssetsModal] = useToggle(false);

	const {
		data: user,
		isFetching,
		isSuccess: isLoaded,
	} = useGetUserQuery(userId as string);

	const { data: company } = useGetOrganizationQuery(orgId as string);

	const [localRows, setLocalRows] = useState<IUser[]>([]);

	const hasAssets = company && Boolean(company.organizationAssets.length);

	const { data: userList, isSuccess: isUsersLoaded } =
		useGetOrganizationUsersQuery(orgId as string);

	const endDates = useMemo(() => {
		if (isUsersLoaded && userList) {
			const result = new Map<number, string>();

			userList.map((user) => {
				result.set(user.id, user.subscriptionEndDate.split(" ")[0]);
			});
			return result;
		}
	}, [isUsersLoaded, userList]);

	useEffect(() => {
		// Reseting
		setLocalRows([]);

		if (userList) {
			const filtered = userList.filter((user) => user.id !== Number(userId));
			sessionStorage.setItem("table-rows", JSON.stringify(filtered));
			const timeOut = setTimeout(() => setLocalRows(filtered), 200);

			return () => clearTimeout(timeOut);
		}
	}, [userList, userId]);

	const organizationEmployee =
		user &&
		company &&
		user.organizationId === company.id &&
		loggedInUser.organizationId === company.id;

	const {
		value: isUserCloseRequested,
		setTrue: requestUserClose,
		setFalse: setUserToDefault,
	} = useBoolean(false);

	const breadcrumbLinks: BreadcrumbLink[] = organizationEmployee
		? []
		: [
			{
				href: AppRoute.OrganizationList,
				text: "Organizations",
			},
		];

	if (user) {
		breadcrumbLinks.push({
			href: `/organizations/${orgId}`,
			text: user.companyName,
		});

		breadcrumbLinks.push({
			text: `${user[UserKey.Name]} ${user[UserKey.Surname]}`,
		});
	}

	return (
		<>
			{isFetching || !user ? (
				<Loader style={{ zIndex: 2, height: '100vh', position: 'sticky' }} />
			) : (
				<section className={style.root}>
					<UserAccountHeader
						selectedUser={user}
						toggleEditUserPage={toggleEditUserPage}
						toggleAssetsModal={toggleAssetsModal}
					>
						<Breadcrumb links={breadcrumbLinks} />
					</UserAccountHeader>
					<UserInfo user={user} />
				</section>
			)}

			<Dialog
				open={isEditUserPage}
				onRequestClose={requestUserClose}
				closeOnOutsideClick
				id="org-user-modal"
				variant="right-side"
				hasCloseButton={false}
			>
				{!isFetching && user && (
					<EditOrganizationUserWithoutAssets
						user={user}
						isUserCloseRequested={isUserCloseRequested}
						setUserToDefault={setUserToDefault}
						toggleEditUserPage={toggleEditUserPage}
					/>
				)}
			</Dialog>
			{localRows.length ? (
				<UsersList
					endDates={endDates}
					hasAssets={hasAssets}
					localRows={localRows}
					setLocalRows={setLocalRows}
					headlineTitle="More User Accounts"
					organizationID={orgId}
				/>
			) : (
				<Loader />
			)}

			{isLoaded && company && (
				<AssetModalWithoutPin
					open={isAssetsOpened}
					toggleAssetsModal={toggleAssetsModal}
					organization={company}
					user={user}
				/>
			)}
		</>
	);
};
