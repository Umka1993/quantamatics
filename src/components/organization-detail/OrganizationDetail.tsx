import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { RouteParams } from "../../types/route-params";
import { useGetOrganizationQuery } from "../../api/organization";
import IApiError from "../../types/api-error";
import useToggle from "../../hooks/useToggle";
import AssetModal from "../asset-modal/AssetModal";
import style from "./edit-organizations.module.scss";
import { EMPTY_ORGANIZATION } from "./utils";
import { useGetOrganizationUsersQuery } from "../../api/user";
import { IUser } from "../../types/user";
import Loader from "../loader";
import OrganizationInfo from "../organization-info/OrganizationInfo";
import OrganizationModal from "../organization-modal/OrganizationModal";
import { UsersList } from "../users-list/users-list";

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
	useEffect(() => {
		if (userList) {
			sessionStorage.setItem("table-rows", JSON.stringify(userList));
			setLocalRows(userList);
		}
	}, [isUsersLoaded, userList]);

	const [isAssetOpened, toggleAssetModal] = useToggle(false);
	const [isOrganizationOpened, toggleOrganizationModal] = useToggle(false);

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
	}, [isUsersLoaded, userList]);


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

			<UsersList
				endDates={endDates}
				hasAssets={hasAssets}
				localRows={localRows}
				setLocalRows={setLocalRows}
				headlineTitle="User Accounts"
				organizationID={id}
			/>
		</>
	);
}
