import React from "react";
import {
    Switch,
    Route
} from "react-router-dom";

import {LayoutSideBarPage} from "../pages/layout-side-bar-page";
import {CreateOrganizationPage} from "../pages/create-organization-page";
import {NotFoundPage} from "../pages/404"
import {SignUpPage} from "../pages/sign-up-page";
import {SignInPage} from "../pages/login-page"

const AppRouter = () => (
    <Switch>
        <Route exact path={'/'} component={LayoutSideBarPage}/>
        <Route exact path={'/research/my-files'} component={LayoutSideBarPage}/>
        <Route exact path={'/research/shared-with-me'} component={LayoutSideBarPage}/>
        <Route exact path={'/research/favorites'} component={LayoutSideBarPage}/>
        <Route exact path={'/add-user'} component={LayoutSideBarPage}/>
        <Route exact path={'/coherence'} component={LayoutSideBarPage}/>
        <Route exact path={'/settings'} component={LayoutSideBarPage}/>
        <Route path={'/create'} component={CreateOrganizationPage}/>
        <Route path={'/organization-edit'} component={LayoutSideBarPage}/>
        <Route path={'/sign-up'} component={SignUpPage}/>
        <Route path={'/reset-password'} component={SignUpPage}/>
        <Route path={'/login'} component={SignInPage}/>
        <Route component={NotFoundPage} />
    </Switch>
);

export default AppRouter

