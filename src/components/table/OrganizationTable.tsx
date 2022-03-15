import React, { useState, useEffect, useCallback } from "react";
import "./styles/table.scss";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";

import EditSVG from "./assets/edit-row-icon.svg";
import { Organization } from "../../types/organization/types";
import { SortDirection, UserRole } from "../../data/enum";
import ISort from "../../types/sort-type";
import { useGetAllOrganizationsQuery } from "../../api/organization";
import Loader from "../loader/";
import useUser from "../../hooks/useUser";
import { ORG_HEADER } from "./utils/constants";
import { Link } from "react-router-dom";
import NoResultsMessage from "./NoResultsMessage";
import style from "./styles/table.module.scss";

interface ITable {
	search?: string;
}

export const OrganizationTable: React.FunctionComponent<ITable> = ({
	search,
}) => {
	const user = useUser();

	// ? Need to be in component to reset sort after update
	const INITIAL_SORT = { name: "", direction: SortDirection.Default };

	const { isLoading, data, isError, isSuccess, error } =
		useGetAllOrganizationsQuery(user?.id as number);

	const [localRows, setLocalRows] = useState<Organization[]>([]);
	const [sort, setSort] = useState<ISort>(INITIAL_SORT);

	const filterOrganizationToOrgAdmin = useCallback(
		(organizations: Organization[]): Organization[] => {
			const filteredOrgs = user?.userRoles.includes(UserRole.Admin)
				? organizations
				: organizations?.filter(
					(organization) =>
						organization.parentId === String(user?.organizationId)
				);

			sessionStorage.setItem("table-rows", JSON.stringify(filteredOrgs));
			return filteredOrgs;
		},
		[user?.userRoles]
	);
	useEffect(() => {
		if (data && isSuccess) {
			setLocalRows(filterOrganizationToOrgAdmin(data));
			setSort(INITIAL_SORT);
		}
	}, [data, isSuccess]);

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

	useEffect(() => {
		const initialOrgs = sessionStorage.getItem("table-rows");
		if (initialOrgs && search?.length) {
			filterOrganizationsToQuery(
				search,
				JSON.parse(initialOrgs) as Organization[]
			);
		} else {
			setLocalRows(filterOrganizationToOrgAdmin(data as Organization[]));
			setSort(INITIAL_SORT);
		}
	}, [search]);

	if (!localRows) return null;

	if (isError) {
		console.log(error);

		return <p>Something went wrong</p>;
	}

	if (isLoading) {
		return (
			<div className={style.loader}>
				<Loader />
			</div>
		);
	}

	if (localRows.length) {
		return (
			<table className={style.root}>
				<thead className={style.head}>
					<tr className={[style.row, style["row--organization"]].join(" ")}>
						{ORG_HEADER.keys.map((key, index) => (
							<SortTableHeader
								key={key}
								name={key}
								text={ORG_HEADER.titles[index]}
								sort={sort}
								localRows={localRows}
								setSort={setSort}
								setLocalRows={setLocalRows}
								className={style.headline}
							/>
						))}

						<th
							className={[style.headline, style["headline--action"]].join(" ")}
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{localRows.map((organization, index) => (
						<tr
							className={[
								style.row,
								style["row--body"],
								style["row--organization"],
							].join(" ")}
							key={index}
						>
							<td className={style.cell}>{organization.name}</td>
							<td className={style.cell}>{organization.customerCrmId}</td>
							<td className={style.cell}>
								{Boolean(organization.customerCrmLink.length) && (
									<a
										className="link"
										href={organization.customerCrmLink}
										target="_blank"
										rel="noopener noreferrer"
									>
										{organization.customerCrmLink}
									</a>
								)}
							</td>
							<td className={style.cell}>
								{organization.comments.length ? organization.comments : "—"}
							</td>
							<td className={style.cell}>
								<Link
									className="table__action"
									to={`/apps/organizations/${organization.id}`}
								>
									<EditSVG role="img" aria-label="edit" fill="currentColor" />
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	} else {
		return (
			<NoResultsMessage dataPresent={!!data?.length} query={search as string} />
		);
	}
};
