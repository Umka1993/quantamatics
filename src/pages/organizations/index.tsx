import React from 'react';
import "./styles/organiations.scss"
import {SideBar} from "../../components/side-bar";
import {OrganizationTable} from "../../components/table/OrganizationTable";
import {EditOrganization} from "../../components/edit-organization/edit-organization";
import {SIDE_BAR_ITEMS} from "../../contstans/constans";
import {TABLE_ITEMS} from "../../contstans/constans";

interface IOrganizations{
    currentPage: string
}

export const Organizations: React.FunctionComponent<IOrganizations> = (props) => {
    const viewMape = () => {
        switch (props.currentPage){
            case '/organization-edit':
                return(
                    <EditOrganization/>
                )
            default:
                return(
                    <div className="organization__list">
                        <h1>List of Organizations</h1>
                        <p>Create and customize organizations for future owners</p>
                        <OrganizationTable rows={TABLE_ITEMS} />
                    </div>
                )
        }
    }
    return(
        <div className="organization">
            {viewMape()}
        </div>
    )
}
