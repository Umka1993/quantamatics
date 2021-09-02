import React from "react";
import {
    Switch,
    Route
} from "react-router-dom";

import {OrganizationsPage} from "../pages/organizations";
import {CreateOrganizationPage} from "../pages/createOrganization";
import {NotFoundPage} from "../pages/404"


const AppRouter = () => (
    <Switch>
        <Route exact path={'/'} component={OrganizationsPage}/>
        <Route path={'/organization'} component={OrganizationsPage}/>
        <Route path={'/create'} component={CreateOrganizationPage}/>
        <Route component={NotFoundPage} />
    </Switch>
);

export default AppRouter

