import React from 'react';
import "./styles/organiations.scss"
import {SideBar} from "../../components/side-bar";


export const OrganizationsPage: React.FunctionComponent = (props) => {
    return(
        <div className="organization">
            <div className="organization__side-bar-container">
                 <SideBar/>
            </div>
            <div className="organization__content-container">
                <h1>Organizations Page</h1>
            </div>
        </div>
    )
}