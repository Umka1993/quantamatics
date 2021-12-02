import React from 'react';
import "./styles/organiations.scss"
import AddIcon from "./assets/add.svg"
import { OrganizationTable } from "../../components/table/OrganizationTable";
import Button from "../../components/button";
import { changeRoute } from "../../store/currentPage/actions";
import { useDispatch } from "react-redux";
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
                    <Headline>Organizations</Headline>
                    <p>Create and manage organizations and user accounts</p>
                </div>


                <Button className="organization__btn" onClick={() => createNew()}>
                    <AddIcon aria-hidden='true' />
                    Add New
                </Button>

            </header>
            <OrganizationTable />
        </section>
    )
}
