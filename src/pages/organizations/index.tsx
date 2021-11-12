import React from 'react';
import "./styles/organiations.scss"
import AddIcon from "./assets/add.svg"
import { OrganizationTable } from "../../components/table/OrganizationTable";
import Button from "../../components/button";
import { changeRoute } from "../../store/currentPage/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Headline from "../../components/page-title/index";

export const Organizations: React.FunctionComponent = (props) => {
    const dispatch = useDispatch();
    const history = useHistory()

    const createNew = () => {
        dispatch(changeRoute('apps/organizations/new-organization'))
        history.push('/apps/organizations/new-organization')
    }

    return (
        <section className="organization">
            <header className="organization__header">
                <div className="organization__titles">
                    <Headline>List of Organizations</Headline>
                    <p>Create and customize organizations for future owners</p>
                </div>


                <Button className="organization__btn" onClick={() => createNew()}>
                    <AddIcon aria-hidden='true' />
                    Add New
                </Button>

            </header>
            <div className="organization__list">

            {/* <div className='organization-table-loader'><Loader /></div> */}
            <OrganizationTable /> 
        
            </div>
        </section>
    )
}
