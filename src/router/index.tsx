import React from "react";
import {
    Switch,
    Route
} from "react-router-dom";

import { LayoutSideBarPage } from "../pages/layout-side-bar-page";
import { NotFoundPage } from "../pages/404"
import FullWidthLayout from "../pages/full-width-layout"

import PrivateRoute from "./private-route";
import UnLoggedRoute from "./unlogged-route";

import { AppRoute } from "../data/enum"

const AppRouter = () => (
    <Switch>
        <PrivateRoute exact path={AppRoute.Home} component={LayoutSideBarPage} />
        <PrivateRoute path={AppRoute.Files} component={LayoutSideBarPage} />
        <PrivateRoute path={AppRoute.Shared} component={LayoutSideBarPage} />
        <PrivateRoute path={AppRoute.Favorites} component={LayoutSideBarPage} />
        <PrivateRoute exact path={AppRoute.Coherence} component={LayoutSideBarPage} />
        <PrivateRoute exact path={AppRoute.Settings} component={LayoutSideBarPage} />
        <PrivateRoute path={AppRoute.Organizations} component={LayoutSideBarPage} />
        <UnLoggedRoute path={AppRoute.SignUp} component={FullWidthLayout} />
        <UnLoggedRoute path={AppRoute.ResetPassword} component={FullWidthLayout} />
        <UnLoggedRoute path={AppRoute.Login} component={FullWidthLayout} />
        <UnLoggedRoute path={AppRoute.ForgotPassword} component={FullWidthLayout} />
        <UnLoggedRoute path={AppRoute.Expired} component={FullWidthLayout} />
        <Route path={AppRoute.Success} component={FullWidthLayout} />
        <UnLoggedRoute path={AppRoute.ExpiredPassword} component={FullWidthLayout} />
        <UnLoggedRoute path={AppRoute.SignUpExpired} component={FullWidthLayout} />
        <Route component={NotFoundPage} />
    </Switch>
);

export default AppRouter

