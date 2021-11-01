import React from "react";
import {
    Switch,
    Route
} from "react-router-dom";

import {LayoutSideBarPage} from "../pages/layout-side-bar-page";
import {NotFoundPage} from "../pages/404"
import {SignUpPage} from "../pages/sign-up-page";
import FullWidthLayout from "../pages/full-width-layout"

import PrivateRoute from "./private-route";

import {AppRoute} from "../data/enum"

const AppRouter = () => (
    <Switch>
        <PrivateRoute exact path={AppRoute.Home} component={LayoutSideBarPage} />
        <PrivateRoute path={AppRoute.Files} component={LayoutSideBarPage} />
        <PrivateRoute path={AppRoute.Shared} component={LayoutSideBarPage}/>
        <PrivateRoute path={AppRoute.Favorites} component={LayoutSideBarPage}/>
        <PrivateRoute exact path={AppRoute.AddUser} component={LayoutSideBarPage}/>
        <PrivateRoute exact path={AppRoute.Coherence} component={LayoutSideBarPage}/>
        <PrivateRoute exact path={AppRoute.Settings} component={LayoutSideBarPage}/>
        <PrivateRoute path={AppRoute.Organizations} component={LayoutSideBarPage}/>
        <Route path={AppRoute.SignUp} component={SignUpPage}/>
        <Route path={AppRoute.ResetPassword} component={SignUpPage}/>
        <Route path={AppRoute.Login} component={FullWidthLayout}/>
        <Route path={AppRoute.ForgoPassword} component={FullWidthLayout}/>
        <Route path={AppRoute.Success} component={FullWidthLayout}/>
        <Route component={NotFoundPage}/>
    </Switch>
);

export default AppRouter

