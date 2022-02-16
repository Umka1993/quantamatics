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
        useGetAllOrganizationsQuery();

    const [localRows, setLocalRows] = useState<Organization[]>([]);
    const [sort, setSort] = useState<ISort>(INITIAL_SORT);

    const filterOrganizationToOrgAdmin = useCallback(
        (organizations: Organization[]) => {
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
            setLocalRows(filterOrganizationToOrgAdmin(data as Organization[]));
            setSort(INITIAL_SORT);
        }
    }, [data, isSuccess]);

    useEffect(() => {

        if (sessionStorage.getItem("table-rows") && search?.length) {
            const normalizedSearchQuery = search.toLocaleLowerCase();

            const filteredOrgs = localRows.filter(
                ({ name, customerCrmId, customerCrmLink, comments }) =>
                    name.toLocaleLowerCase().includes(normalizedSearchQuery) ||
                    customerCrmLink.toLocaleLowerCase().includes(normalizedSearchQuery) ||
                    customerCrmId.toLocaleLowerCase().includes(normalizedSearchQuery) ||
                    comments.toLocaleLowerCase().includes(normalizedSearchQuery)
            );

            setLocalRows(filteredOrgs);
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
            <div className="table-loader">
                <Loader />
            </div>
        );
    }

    if (localRows.length) {
        return (
            <table className="table table--organization">
                <thead className="table__head">
                    <tr className="table__header">
                        {ORG_HEADER.keys.map((key, index) => (
                            <SortTableHeader
                                key={key}
                                name={key}
                                text={ORG_HEADER.titles[index]}
                                sort={sort}
                                localRows={localRows}
                                setSort={setSort}
                                setLocalRows={setLocalRows}
                            />
                        ))}

                        <th className="table__headline table__headline--hidden">Actions</th>
                    </tr>
                </thead>
                <tbody className="table__body">
                    {localRows.map((organization, index) => (
                        <tr className="table__row" key={index}>
                            <td className="table__cell">{organization.name}</td>
                            <td className="table__cell">{organization.customerCrmId}</td>
                            <td className="table__cell">
                                <a
                                    className="table__link"
                                    href={organization.customerCrmLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {organization.customerCrmLink}
                                </a>
                            </td>
                            <td className="table__cell table__cell--comment">
                                {organization.comments}
                            </td>
                            <td className="table__cell table__cell--actions">
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
        return <NoResultsMessage query={search as string} />;
    }
};
