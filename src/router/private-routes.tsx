import { AppRoute, UserRole } from "../data/enum";
import React, { ReactElement } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import useUser from "../hooks/useUser";
import { JupyterFrame } from "../components/jupyter-frame";
import OrganizationList from "../components/organization-list";
import { CreateOrganizationForm, AddUserForm } from "../components/form/";
import { EditOrganization } from "../components/edit-organization/edit-organization";
import SuccessMessage from "../components/success-message";

export default function PrivateRoutes(): ReactElement {
    const user = useUser();

    const isOrganizationsAvailable =
        user &&
        (user.userRoles.includes(UserRole.Admin) ||
            user.userRoles.includes(UserRole.OrgOwner));

    const isEditOrgAvailable =
        isOrganizationsAvailable || user?.userRoles.includes(UserRole.OrgAdmin);

    const isCoherence = user?.userRoles.includes(UserRole.Coherence);

    const isResearch = user?.userRoles.includes(UserRole.Research);

    const HomePath = isResearch
        ? AppRoute.Files
        : isCoherence
            ? AppRoute.ExcelLibrary
            : isOrganizationsAvailable
                ? AppRoute.OrganizationList
                : isEditOrgAvailable
                    ? `/apps/organizations/${user?.organizationId}`
                    : "/demo";

    return (
        <Routes>
            <Route path="*" element={<Navigate to={HomePath} />} />
            <Route path="/demo" element={<h1>Demo Page</h1>} />
            {isResearch && (
                <Route path={AppRoute.Files} element={<JupyterFrame type="files" />} />
            )}

            {isCoherence && (
                <Route
                    path={AppRoute.Coherence}
                    element={<JupyterFrame type="coherence" />}
                />
            )}

            {isCoherence && (
                <Route
                    path={AppRoute.ExcelLibrary}
                    element={<JupyterFrame type="excelLibrary" />}
                />
            )}

            {isOrganizationsAvailable && (
                <>
                    <Route
                        path="/apps/organizations/list"
                        element={<OrganizationList />}
                    />
                    <Route
                        path="/apps/organizations/new-organization"
                        element={<CreateOrganizationForm />}
                    />
                </>
            )}

            {isEditOrgAvailable && (
                <>
                    <Route
                        path="/apps/organizations/:id"
                        element={<EditOrganization />}
                    />
                    <Route
                        path="/apps/organizations/:id/add-user"
                        element={<AddUserForm />}
                    />
                    <Route path={AppRoute.Success} element={<SuccessMessage />} />
                </>
            )}
        </Routes>
    );
}
