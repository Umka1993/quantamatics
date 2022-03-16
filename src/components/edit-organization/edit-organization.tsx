import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import Button from "../button";
import { UserTable } from "../table/UserTable";
import { useParams } from "react-router-dom";
import type { RouteParams } from "../../types/route-params";
import { useGetOrganizationQuery } from "../../api/organization";
import IApiError from "../../types/api-error";
import useUser from "../../hooks/useUser";
import { AppRoute, UserRole } from "../../data/enum";

import { EditOrganizationForm } from "../form";
import useToggle from "../../hooks/useToggle";
import AssetModal from "../asset-modal/AssetModal";
import style from "./edit-organizations.module.scss";
import SpriteIcon from "../sprite-icon/SpriteIcon";
import { EMPTY_ORGANIZATION } from "./utils";
import { useGetOrganizationUsersQuery } from "../../api/user";
import { IUpdateUser, IUser } from "../../types/user";
import Dialog from "../dialog";
import { EditProfile } from "../edit-modal/edit-profile";
import Loader from "../loader";
import Breadcrumb, { BreadcrumbLink } from "../breadcrumb/Breadcrumb";

export const EditOrganization: FunctionComponent = () => {
	const user = useUser();

	const { id } = useParams<RouteParams>();

	const {
		data: organization,
		isError,
		error,
		isLoading: isOrganizationLoading,
	} = useGetOrganizationQuery(id as string);

	const {
		data: userList,
		isSuccess: isUsersLoaded,
		isLoading: isUsersLoading,
	} = useGetOrganizationUsersQuery(id as string);

	const [localRows, setLocalRows] = useState<IUser[]>([]);
	const [selectedUser, setUser] = useState<IUser | null>(null);

	useEffect(() => {
		if (userList) {
			sessionStorage.setItem("table-rows", JSON.stringify(userList));
			setLocalRows(userList);
		}
	}, [isUsersLoaded, userList]);

	const isHaveAccessToOrgList =
		user?.userRoles.includes(UserRole.Admin) ||
		user?.userRoles.includes(UserRole.OrgOwner);

	const [isAssetOpened, toggleAssetModal] = useToggle(false);

	const hasAssets =
		organization && Boolean(organization.organizationAssets.length);

	const endDates = useMemo(() => {
		if (userList) {
			const result = new Map<number, string>();

			userList.map((user) => {
				result.set(user.id, user.subscriptionEndDate.split(" ")[0]);
			});
			return result;
		}
	}, [isUsersLoaded]);

	const closeModal = () => setUser(null);

	if (isOrganizationLoading && isUsersLoading) {
		return <Loader />;
	}

	const links: BreadcrumbLink[] = [{ href: AppRoute.OrganizationList, text: "Organizations" }]

	organization && links.push({ text: organization.name })

	return (
		<>
			<div className={style.organization}>
				<Breadcrumb
					links={links}
					className={style.nav}
				/>
				{isError ? (
					<p>Error on loading data: {(error as IApiError).data} </p>
				) : (
					<>
						<EditOrganizationForm
							organization={organization || EMPTY_ORGANIZATION}
							isHaveAccessToOrgList={isHaveAccessToOrgList}
							toggleAssetModal={toggleAssetModal}
						/>
						<AssetModal
							open={isAssetOpened}
							closeFunction={toggleAssetModal}
							organization={organization || EMPTY_ORGANIZATION}
						/>
					</>
				)}
			</div>
			<section>
				<div className={style.subheader}>
					<h2>User Accounts</h2>
					{!hasAssets && (
						<p id="warning-asset" className={style.warning}>
							Please set up assets first to invite users to the organization
						</p>
					)}

					<Button
						className={style.add}
						href={hasAssets ? "add-user" : undefined}
						aria-describedby={hasAssets ? undefined : "warning-asset"}
						disabled={!hasAssets}
					>
						<SpriteIcon icon="plus" width={10} />
						Add
					</Button>
				</div>
				{endDates && (
					<UserTable
						list={localRows}
						setter={setLocalRows}
						dates={endDates}
						userSetter={setUser}
					/>
				)}
			</section>

			<Dialog
				open={selectedUser !== null}
				onRequestClose={closeModal}
				closeOnOutsideClick
				headline="Edit User Account"
				id="org-user-modal"
				wrapperClass="edit-account"
			>
				{selectedUser !== null && (
					<EditProfile user={selectedUser} onClose={closeModal} />
				)}
			</Dialog>
		</>
	);
};
