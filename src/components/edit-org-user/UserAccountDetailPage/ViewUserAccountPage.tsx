import style from "./style/user-account-detail.module.scss";
import { AppRoute, UserKey } from "../../../data/enum";
import { useParams } from "react-router";
import { useGetUserQuery } from "../../../api/user";

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

	const breadcrumbLinks: BreadcrumbLink[] = [];

	organizationEmployee &&
		breadcrumbLinks.push({
			href: AppRoute.OrganizationList,
			text: "Organizations",
		});

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
			{!isFetching && user ? (
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
			) : (
				<Loader />
			)}
			<Dialog
				open={isEditUserPage}
				onRequestClose={requestUserClose}
				closeOnOutsideClick
				id="org-user-modal"
				variant="right-side"
				hasCloseButton={false}
			>
				{isEditUserPage && user ? (
					<EditOrganizationUserWithoutAssets
						user={user}
						isUserCloseRequested={isUserCloseRequested}
						setUserToDefault={setUserToDefault}
						toggleEditUserPage={toggleEditUserPage}
					/>
				) : (
					<Loader />
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
		</>
	);
};
