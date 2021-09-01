import React from 'react';
import "./styles/organiations.scss"
import {SideBar} from "../../components/side-bar";
import {Table} from "../../components/table";
import {SIDE_BAR_ITEMS} from "../../contstans/constans";
import {TABLE_ITEMS} from "../../contstans/constans";

export const OrganizationsPage: React.FunctionComponent = (props) => {
    return(
        <div className="organization">
            <div className="organization__side-bar-container">
                 <SideBar items={SIDE_BAR_ITEMS}/>
            </div>
            <div className="organization__content-container">
                <h1>Organizations Page</h1>
                <p>Create and customize organizations for future owners</p>
                <Table rows={TABLE_ITEMS} />
            </div>
        </div>
    )
}