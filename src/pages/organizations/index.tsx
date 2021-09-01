import React from 'react';
import "./styles/organiations.scss"
import {SideBar} from "../../components/side-bar";
import {Table} from "../../components/table";
import {IRow} from "../../types/table/types";

const ROWS: IRow[] = [
    {
        organization: 'Dudka Agency',
        customerId: '1231232',
        comments: 'temporary company for internal needs'
    },
    {
        organization: 'General Motors',
        customerId: '6542678',
        comments: 'temporary company for internal needs'
    },
    {
        organization: 'General Electric',
        customerId: '9873422',
        comments: 'temporary company for internal needs'
    },
    {
        organization: 'The Walt Disney Company',
        customerId: '5647444',
        comments: 'temporary company for internal needs'
    },
]

export const OrganizationsPage: React.FunctionComponent = (props) => {
    return(
        <div className="organization">
            <div className="organization__side-bar-container">
                 <SideBar/>
            </div>
            <div className="organization__content-container">
                <h1>Organizations Page</h1>
                <p>Create and customize organizations for future owners</p>
                <Table rows={ROWS} />
            </div>
        </div>
    )
}