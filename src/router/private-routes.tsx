import { AppRoute, UserRole } from "../data/enum";
import React, { ReactElement } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import useUser from "../hooks/useUser";
import { JupyterFrame } from "../components/jupyter-frame";
import OrganizationList from "../components/organization-list";
import { CreateOrganizationForm, AddUserForm } from "../components/form/";
import { EditOrganization } from "../components/edit-organization/edit-organization";

export default function PrivateRoutes(): ReactElement {
    const user = useUser();

    const isOrganizationAvailable =
        user &&
        (user.userRoles.includes(UserRole.Admin) ||
            user.userRoles.includes(UserRole.OrgOwner));

    const isEditOrgAvailable =
        isOrganizationAvailable || user?.userRoles.includes(UserRole.OrgAdmin);

    const isCoherence = user?.userRoles.includes(UserRole.Coherence);

    const isResearch = user?.userRoles.includes(UserRole.Research);

    const HomePath = isResearch
        ? AppRoute.Files
        : isCoherence
            ? AppRoute.Coherence
            : isOrganizationAvailable
                ? "/apps/organizations/list"
                : `/apps/organizations/${user?.organizationId}`;

    return (
        <Routes>
            <Route path="*" element={<Navigate to={HomePath} />} />

            {isResearch && (
                <Route path={AppRoute.Files} element={<JupyterFrame type="files" />} />
            )}

            {isCoherence && (
                <Route
                    path={AppRoute.Coherence}
                    element={<JupyterFrame type="coherence" />}
                />
            )}

            {isOrganizationAvailable && (
                <>
                    <Route path="/apps/organizations/list" element={<OrganizationList />} />
                    <Route path="/apps/organizations/new-organization" element={<CreateOrganizationForm />} />
                </>
            )}

            {isEditOrgAvailable && (
                <>
                    <Route path="/apps/organizations/:id" element={<EditOrganization />} />
                    <Route path="/apps/organizations/:id/add-user" element={<AddUserForm />} />
                </>
            )}
        </Routes>
    );
}
