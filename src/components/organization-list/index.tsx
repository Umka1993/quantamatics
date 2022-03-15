import React, { ReactElement, useCallback, useEffect, useState } from "react";
import style from "./organization-list.module.scss";
import { OrganizationTable } from "../table/OrganizationTable";
import Button from "../button";
import Headline from "../page-title/index";
import { AppRoute, UserRole } from "../../data/enum";
import SearchField from "../search-field/SearchField";
import SpriteIcon from "../sprite-icon/SpriteIcon";
import useUser from "../../hooks/useUser";
import { useGetAllOrganizationsQuery } from "../../api/organization";
import { Organization } from "../../types/organization/types";
import Loader from "../loader";
import NoResultsMessage from "../table/NoResultsMessage";

export default function OrganizationList(): ReactElement {
	const [search, setSearch] = useState("");
	const user = useUser();

	const { data, isError, isSuccess } = useGetAllOrganizationsQuery(
		user?.id as number
	);

	const [localRows, setLocalRows] = useState<Organization[]>([]);

	const filterOrganizationToOrgAdmin = useCallback(
		(organizations: Organization[]): Organization[] => {
			const filteredOrgs = user?.userRoles.includes(UserRole.Admin)
				? organizations
				: organizations?.filter(
					(organization) =>
						organization.parentId === String(user?.organizationId)
				);
			return filteredOrgs;
		},
		[user?.userRoles, data]
	);

	useEffect(() => {
		if (data && isSuccess) {
			setLocalRows(filterOrganizationToOrgAdmin(data));
		}
	}, [data, isSuccess]);

	useEffect(() => {
		if (data && search.length) {
			filterOrganizationsToQuery(search, filterOrganizationToOrgAdmin(data));
		} else {
			setLocalRows(filterOrganizationToOrgAdmin(data as Organization[]));
		}
	}, [search, data]);

	const filterOrganizationsToQuery = useCallback(
		(query: string, initialOrgs: Organization[]) => {
			const normalizedSearchQuery = query.toLocaleLowerCase();

			const filteredOrgs = initialOrgs.filter(
				({ name, customerCrmId, customerCrmLink, comments }) =>
					name.toLocaleLowerCase().includes(normalizedSearchQuery) ||
					customerCrmLink.toLocaleLowerCase().includes(normalizedSearchQuery) ||
					customerCrmId.toLocaleLowerCase().includes(normalizedSearchQuery) ||
					comments.toLocaleLowerCase().includes(normalizedSearchQuery)
			);

			setLocalRows(filteredOrgs);
		},
		[search, setLocalRows]
	);

	const listIsReady = localRows && isSuccess;
	return (
		<>
			<header className={style.header}>
				<Headline>Organizations</Headline>
				<SearchField search={search} setSearch={setSearch} />
				<Button className={style.button} href={AppRoute.CreateOrganization}>
					<SpriteIcon icon="plus" width={10} />
					Add New
				</Button>
			</header>

			{isError && <p>Something went wrong</p>}

			{!listIsReady && (
				<div
					style={{
						position: "relative",
						height: "60vh",
					}}
				>
					<Loader />
				</div>
			)}

			{listIsReady &&
				(localRows.length ? (
					<OrganizationTable list={localRows} setter={setLocalRows} />
				) : (
					<NoResultsMessage
						dataPresent={Boolean(localRows.length)}
						query={search as string}
					/>
				))}
		</>
	);
}
