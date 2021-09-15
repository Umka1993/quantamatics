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
import {ReSearchPage} from "../pages/research-page";

const AppRouter = () => (
    <Switch>
        <Route exact path={'/'} component={LayoutSideBarPage}/>
        <Route path={'/create'} component={CreateOrganizationPage}/>
        <Route path={'/organization-edit'} component={LayoutSideBarPage}/>
        <Route path={'/sign-up'} component={SignUpPage}/>
        <Route path={'/login'} component={SignInPage}/>
        <Route path={'/research'} component={ReSearchPage}/>
        <Route component={NotFoundPage} />
    </Switch>
);

export default AppRouter

