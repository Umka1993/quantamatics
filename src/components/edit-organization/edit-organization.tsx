import React, {FunctionComponent, useEffect} from "react";
import "./styles/edit-organizations.scss";
import AddIcon from "./assets/human-add.svg";
import Button from "../button";
import { UserTable } from "../table/UserTable";
import { useParams } from "react-router-dom";
import type { RouteParams } from "../../types/route-params";
import { useGetOrganizationQuery } from "../../api/organization";
import IApiError from "../../types/api-error";
import useUser from "../../hooks/useUser";
import { UserRole } from "../../data/enum";

import { EditOrganizationForm } from "../form";

export const EditOrganization: FunctionComponent = () => {
    const user = useUser();

    const { id } = useParams<RouteParams>();

    const { data, isError, error, isLoading } = useGetOrganizationQuery(
        id as string
    );

    const isHaveAccessToOrgList =
        user?.userRoles.includes(UserRole.Admin) ||
        user?.userRoles.includes(UserRole.OrgOwner);

    return (
        <div className="edit-organization">
            {isError ? (
                <p>Error on loading data: {(error as IApiError).data} </p>
            ) : (
                <EditOrganizationForm
                    organization={data}
                    isHaveAccessToOrgList={isHaveAccessToOrgList}
                    externalLoad={isLoading}
                />
            )}
            <section className="edit-organization__user-list">
                <div className="edit-organization__user-list-header">
                    <h2 className="sub-headline">User Accounts</h2>

                    <Button className="edit-organization__user-list-add" href="add-user">
                        <AddIcon />
                        Add New
                    </Button>
                </div>

                <UserTable orgId={id as string} />
            </section>
        </div>
    );
};
