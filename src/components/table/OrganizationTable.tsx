import React, { useState, useEffect } from "react";
import "./styles/table.scss";
import { useHistory } from "react-router-dom";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";

import EditSVG from "./assets/edit-row-icon.svg";
import DeleteSVG from "./assets/delete-row-icon.svg";

import classNames from "classnames";
import { useDispatch } from "react-redux";
import { changeRoute } from "../../store/currentPage/actions";
import { Organization } from "../../types/organization/types";
import { OrganizationKey, SortDirection, UserRole } from "../../data/enum";
import ISort from "../../types/sort-type";
import { useGetAllOrganizationsQuery, useDeleteOrganizationMutation } from "../../api/organization";
import Loader from "../loader/";
import useUser from "../../hooks/useUser";

interface ITable {
}

export const OrganizationTable: React.FunctionComponent<ITable> = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const user = useUser();

    const { isLoading, data, isError, isSuccess, error } =
        useGetAllOrganizationsQuery();

    const [deleteOrg, { isSuccess: isDeleted }] = useDeleteOrganizationMutation();

    const [localRows, setLocalRows] = useState<Organization[]>([]);

    const [itemDeleting, setItemDeleting] = useState<number | null>(null);
    const [sort, setSort] = useState<ISort>({
        name: "",
        direction: SortDirection.Default,
    });

    const handleEditRoute = (route: string, id: string) => {
        dispatch(changeRoute(route));
        history.push("/");
        history.push("/" + route + `/${id}`);
    };


    function filterOrganizationToOrgAdmin(organizations: Organization[]): Organization[] {
        return user?.userRoles.includes(UserRole.Admin)
            ? organizations
            : organizations?.filter((organization) => organization.parentId === String(user?.organizationId))

    }
    useEffect(() => {
        isSuccess && sort.direction === SortDirection.Default 
            && setLocalRows(filterOrganizationToOrgAdmin(data as Organization[]))

    }, [sort, data, isSuccess]);

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
                    <SortTableHeader
                        name={OrganizationKey.Name}
                        text="Organization Name"
                        sort={sort}
                        localRows={localRows}
                        setSort={setSort}
                        setLocalRows={setLocalRows}
                    />

                    <SortTableHeader
                        name={OrganizationKey.IdCRM}
                        text="CRM Customer ID "
                        sort={sort}
                        localRows={localRows}
                        setSort={setSort}
                        setLocalRows={setLocalRows}
                    />

                    <SortTableHeader
                        name={OrganizationKey.LinkCRM}
                        text="CRM Customer link"
                        sort={sort}
                        localRows={localRows}
                        setSort={setSort}
                        setLocalRows={setLocalRows}
                    />

                    <SortTableHeader
                        name={OrganizationKey.Comment}
                        text="Comments"
                        sort={sort}
                        localRows={localRows}
                        setSort={setSort}
                        setLocalRows={setLocalRows}
                    />

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
                            <button
                                type="button"
                                className="table__action"
                                onClick={() =>
                                    handleEditRoute("apps/organizations", organization.id)
                                }
                            >
                                <EditSVG role="img" aria-label="edit" fill="currentColor" />
                            </button>
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
