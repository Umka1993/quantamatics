import React from "react";
import "./styles/edit-organization-page.scss"
import {SideBar} from "../../components/side-bar";
import {EditOrganization} from "../../components/edit-organization/edit-organization";
import {SIDE_BAR_ITEMS} from "../../contstans/constans";


export const EditOrganizationPage: React.FunctionComponent = (props) => {
    return (
        <div className="edit-organization-page">
            <div className="edit-organization-page__side-bar-container">
                <SideBar items={SIDE_BAR_ITEMS}/>
            </div>
            <div className="edit-organization-page__content-container">
                <EditOrganization/>
            </div>
        </div>
    )
}