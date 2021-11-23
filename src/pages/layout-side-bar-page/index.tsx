import React from "react";
import { useDispatch } from "react-redux";
import { changeRoute } from "../../store/currentPage/actions";
import { SideBar } from "../../components/side-bar";
import { Organizations } from "../organizations";
import { JupyterFrame } from "../../components/jupyter-frame";
import "./styles/layout-side-bar-page.scss";
import { Switch, Route, Redirect } from "react-router-dom";
import { EditOrganization } from "../../components/edit-organization/edit-organization";
import { CreateOrganizationForm, AddUserForm } from "../../components/form";
import useUser from "../../hooks/useUser";
import { UserRole, AppRoute } from "../../data/enum";

export const LayoutSideBarPage: React.FunctionComponent = () => {
    const user = useUser();

    const isOrganizationAvailable =
        user &&
        (user.userRoles.includes(UserRole.Admin) ||
            user.userRoles.includes(UserRole.OrgOwner));

    const isEditOrgAvailable =
        isOrganizationAvailable || user?.userRoles.includes(UserRole.OrgAdmin);

    const isCoherence = user?.userRoles.includes(UserRole.Coherence);

    const HomePath = isOrganizationAvailable
        ? "/apps/organizations/list"
        : isEditOrgAvailable
            ? `/apps/organizations/${user?.organizationId}`
            : isCoherence ? AppRoute.Coherence : AppRoute.Files;

    return (
        <div className="layout-page app__main">
            <SideBar />

            <div className="layout-page__scroll">
                <main className="layout-page__content-container">
                    <Switch>
                        <Route exact path="/">
                            <Redirect push to={HomePath} />
                        </Route>

                        <Route path="/research/my-files">

                            <JupyterFrame type="files" />

                        </Route>

                        <Route path={AppRoute.Coherence}>
                            {isCoherence ? (
                                <JupyterFrame type="coherence" />
                            ) : (
                                <Redirect to={AppRoute.Home} />
                            )}
                        </Route>

                        {isOrganizationAvailable && (
                            <Route
                                path="/apps/organizations/list"
                                component={Organizations}
                            />
                        )}

                        {isOrganizationAvailable && (
                            <Route
                                path="/apps/organizations/new-organization"
                                component={CreateOrganizationForm}
                            />
                        )}

                        {isEditOrgAvailable && (
                            <Route
                                path="/apps/organizations/:id/add-user"
                                component={AddUserForm}
                            />
                        )}

                        {isEditOrgAvailable && (
                            <Route
                                path="/apps/organizations/:id"
                                component={EditOrganization}
                            />
                        )}
                    </Switch>
                </main>
            </div>
        </div>
    );
};
