import { useEffect, useMemo, useState } from "react";
import Button from "../button";
import { UserTable } from "../table/UserTable";
import { useNavigate, useParams } from "react-router-dom";
import type { RouteParams } from "../../types/route-params";
import { useGetOrganizationQuery } from "../../api/organization";
import IApiError from "../../types/api-error";
import useToggle from "../../hooks/useToggle";
import AssetModal from "../asset-modal/AssetModal";
import style from "./edit-organizations.module.scss";
import SpriteIcon from "../sprite-icon/SpriteIcon";
import { EMPTY_ORGANIZATION } from "./utils";
import { useGetOrganizationUsersQuery } from "../../api/user";
import { IUser } from "../../types/user";
import Loader from "../loader";
import OrganizationInfo from "../organization-info/OrganizationInfo";
import OrganizationModal from "../organization-modal/OrganizationModal";
import useBoolean from "../../hooks/useBoolean";
import { UserKey } from "../../data/enum";
import Dialog from "../dialog";
import EditOrganizationUser from "../edit-org-user/EditOrganizationUser";
import { useGetUserAssetsQuery } from "../../api/asset";

export default function OrganizationDetail() {
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

	const [isAssetOpened, toggleAssetModal] = useToggle(false);
	const [isOrganizationOpened, toggleOrganizationModal] = useToggle(false);
	const navigate = useNavigate();
	const { id: orgId } = useParams<RouteParams>();
	const hasAssets =
		organization && Boolean(organization.organizationAssets.length);

	const endDates = useMemo(() => {
		if (isUsersLoaded && userList) {
			const result = new Map<number, string>();

			userList.map((user) => {
				result.set(user.id, user.subscriptionEndDate.split(" ")[0]);
			});
			return result;
		}
	}, [isUsersLoaded,userList]);

	const closeModal = () => setUser(null);
	// ! Temp kludge
	const {
		value: isUserCloseRequested,
		setTrue: requestUserClose,
		setFalse: setUserToDefault,
	} = useBoolean(false);

	useEffect(() => {
		if (selectedUser) {
			navigate(`/organizations/${orgId}/user/${selectedUser[UserKey.Id]}/view`);
		}
	}, [selectedUser]);

	if (isOrganizationLoading || isUsersLoading) {
		return <Loader />;
	}

	const selectedOrganization = organization || EMPTY_ORGANIZATION;

	return (
		<>
			{isError ? (
				<p className={style.organization}>
					Error on loading data: {(error as IApiError).data}{" "}
				</p>
			) : (
				<>
					<OrganizationInfo
						organization={selectedOrganization}
						toggleAssetModal={toggleAssetModal}
						toggleOrganizationModal={toggleOrganizationModal}
						className={style.organization}
					/>

					<AssetModal
						open={isAssetOpened}
						closeFunction={toggleAssetModal}
						organization={selectedOrganization}
					/>

					<OrganizationModal
						open={isOrganizationOpened}
						closeFunction={toggleOrganizationModal}
						organization={selectedOrganization}
					/>
				</>
			)}

			<section>
				<div className={style.subheader}>
					<h2>User Accounts</h2>
					{!hasAssets && (
						<p id="warning-asset" className={style.warning}>
							Please assign assets to the organization to add user accounts
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

			{/*<Dialog*/}
			{/*	open={selectedUser !== null}*/}
			{/*	onRequestClose={requestUserClose}*/}
			{/*	closeOnOutsideClick*/}
			{/*	id="org-user-modal"*/}
			{/*	variant="right-side"*/}
			{/*	hasCloseButton={false}*/}
			{/*>*/}
			{/*{selectedUser !== null && (*/}
			{/*	<EditOrganizationUser*/}
			{/*		user={selectedUser}*/}
			{/*		onClose={closeModal}*/}
			{/*		isUserCloseRequested={isUserCloseRequested}*/}
			{/*		setUserToDefault={setUserToDefault}*/}
			{/*	/>*/}
			{/*)}*/}
			{/*</Dialog>*/}
		</>
	);
}
