import React from "react";
import {
    Switch,
    Route
} from "react-router-dom";

import {OrganizationsPage} from "../pages/organizations";
import {CreateOrganizationPage} from "../pages/create-organization";
import {NotFoundPage} from "../pages/404"
import {EditOrganizationPage} from "../pages/edit-orgranization-page/edit-organization-page";


const AppRouter = () => (
    <Switch>
        <Route exact path={'/'} component={OrganizationsPage}/>
        <Route path={'/organization'} component={OrganizationsPage}/>
        <Route path={'/create'} component={CreateOrganizationPage}/>
        <Route path={'/organization-edit'} component={EditOrganizationPage}/>
        <Route component={NotFoundPage} />
    </Switch>
);

export default AppRouter

