import React, { useState, useEffect } from "react";
import "./styles/table.scss";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";

import EditSVG from "./assets/edit-row-icon.svg";
import DeleteSVG from "./assets/delete-row-icon.svg";

import classNames from "classnames";
import { Organization } from "../../types/organization/types";
import { SortDirection, UserRole } from "../../data/enum";
import ISort from "../../types/sort-type";
import { useGetAllOrganizationsQuery, useDeleteOrganizationMutation } from "../../api/organization";
import Loader from "../loader/";
import useUser from "../../hooks/useUser";
import { ORG_HEADER } from "./utils/constants";
import { Link } from 'react-router-dom'

interface ITable {
}

export const OrganizationTable: React.FunctionComponent<ITable> = () => {
    const user = useUser();

    // ? Need to be in component to reset sort after update
    const INITIAL_SORT = { name: "", direction: SortDirection.Default }

    const { isLoading, data, isError, isSuccess, error } =
        useGetAllOrganizationsQuery();

    const [deleteOrg, { isSuccess: isDeleted }] = useDeleteOrganizationMutation();

    const [localRows, setLocalRows] = useState<Organization[]>([]);

    const [itemDeleting, setItemDeleting] = useState<number | null>(null);
    const [sort, setSort] = useState<ISort>(INITIAL_SORT);

    function filterOrganizationToOrgAdmin(organizations: Organization[]): Organization[] {
        const filteredOrgs = user?.userRoles.includes(UserRole.Admin)
            ? organizations
            : organizations?.filter((organization) => organization.parentId === String(user?.organizationId))

        sessionStorage.setItem('table-rows', JSON.stringify(filteredOrgs))
        return filteredOrgs;

    }
    useEffect(() => {
        if (data && isSuccess) {
            setLocalRows(filterOrganizationToOrgAdmin(data as Organization[]))
            setSort(INITIAL_SORT);
        }


    }, [data, isSuccess]);

    // ? For the future use

    const handleDeleteOrganization = (id: string, index: number) => {
        setItemDeleting(index)
        deleteOrg(id).unwrap()
    }

    useEffect(() => {
        if (isDeleted) {
            setItemDeleting(null);
        }
    }, [isDeleted])

    if (!localRows) return null;

    if (isError) {
        console.log(error);

        return <div>Something went wrong</div>;
    }

    if (isLoading) {
        return (
            <div className="table-loader">
                <Loader />
            </div>
        );
    }

    return (
        <table className="table table--organization">
            <thead className="table__head">
                <tr className="table__header">
                    {ORG_HEADER.keys.map((key, index) =>
                        <SortTableHeader
                            key={key}
                            name={key}
                            text={ORG_HEADER.titles[index]}
                            sort={sort}
                            localRows={localRows}
                            setSort={setSort}
                            setLocalRows={setLocalRows}
                        />)}

                    <th className="table__headline table__headline--hidden">Actions</th>
                </tr>
            </thead>
            <tbody className="table__body">
                {localRows.map((organization, index) => (
                    <tr
                        className={classNames("table__row", {
                            deleting: index === itemDeleting,
                        })}
                        key={index}
                    >
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
                            <button
                                type="button"
                                className="table__action"
                                onClick={() => handleDeleteOrganization(organization.id, index)}
                                // disabled
                            >
                                <DeleteSVG role="img" aria-label="delete" fill="currentColor" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
