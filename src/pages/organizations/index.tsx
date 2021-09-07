import React from 'react';
import "./styles/organiations.scss"
import {SideBar} from "../../components/side-bar";
import {OrganizationTable} from "../../components/table/OrganizationTable";
import {SIDE_BAR_ITEMS} from "../../contstans/constans";
import {TABLE_ITEMS} from "../../contstans/constans";

export const OrganizationsPage: React.FunctionComponent = (props) => {
    return(
        <div className="organization">
            <div className="organization__side-bar-container">
                 <SideBar items={SIDE_BAR_ITEMS}/>
            </div>
            <div className="organization__content-container">
                <h1>List of Organizations</h1>
                <p>Create and customize organizations for future owners</p>
                <OrganizationTable rows={TABLE_ITEMS} />
            </div>
        </div>
    )
}