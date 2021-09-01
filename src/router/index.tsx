import React from "react";
import {
    Switch,
    Route
} from "react-router-dom";

import {OrganizationsPage} from "../pages/organizations";
import {NotFoundPage} from "../pages/404"


const AppRouter = () => (
    <Switch>
        <Route exact path={'/'} component={OrganizationsPage}/>
        <Route path={'/organization'} component={OrganizationsPage}/>
        <Route component={NotFoundPage} />
    </Switch>
);

export default AppRouter

