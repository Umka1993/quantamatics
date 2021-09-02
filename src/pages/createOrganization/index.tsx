import React from 'react';
import "./styles/organiations.scss"
import {SideBar} from "../../components/side-bar";
import {CreateOrganization} from "../../components/createOrganization";
import {SIDE_BAR_ITEMS} from "../../contstans/constans";

export const CreateOrganizationPage: React.FunctionComponent = (props) => {
    return(
        <div className="create-organization-page">
            <div className="create-organization-page__side-bar-container">
                 <SideBar items={SIDE_BAR_ITEMS}/>
            </div>
            <div className="create-organization-page__content-container">
                <CreateOrganization />
            </div>
        </div>
    )
}