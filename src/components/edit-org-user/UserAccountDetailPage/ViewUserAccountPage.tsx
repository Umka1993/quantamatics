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
			document.body.classList.remove("scroll-lock");
			const result = new Map<number, string>();

			userList.map((user) => {
				result.set(user.id, user.subscriptionEndDate.split(" ")[0]);
			});
			return result;
		}
	}, [isUsersLoaded, userList]);

	useEffect(() => {
		if (userList) {
			const filtered = userList.filter((user) => user.id !== Number(userId));
			sessionStorage.setItem("table-rows", JSON.stringify(filtered));
			setLocalRows(filtered);
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

	if (!user) {
		return <Loader />;
	}

	if (isFetching) {
		return <Loader />;
	}

	const breadcrumbLinks: BreadcrumbLink[] = organizationEmployee ? [] : [
		{
			href: AppRoute.OrganizationList as string,
			text: "Organizations",
		}
	]

	breadcrumbLinks.push({
		href: `/organizations/${orgId}`,
		text: user.companyName,
	})

	breadcrumbLinks.push({
		text: `${user[UserKey.Name]} ${user[UserKey.Surname]}`
	})

	return (
		<section>
			<div className={style.root}>
				<UserAccountHeader
					selectedUser={user}
					toggleEditUserPage={toggleEditUserPage}
					toggleAssetsModal={toggleAssetsModal}
				>
					<Breadcrumb
						links={breadcrumbLinks}
					/>
				</UserAccountHeader>
				<UserInfo user={user} />
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
						user={user}
						isUserCloseRequested={isUserCloseRequested}
						setUserToDefault={setUserToDefault}
						toggleEditUserPage={toggleEditUserPage}
					/>
				)}
			</Dialog>

			{isLoaded && company && (
				<AssetModalWithoutPin
					open={isAssetsOpened}
					toggleAssetsModal={toggleAssetsModal}
					organization={company}
					user={user}
				/>
			)}
		</section>
	);
};
