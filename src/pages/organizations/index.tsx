import React, { useEffect, useState } from 'react';
import "./styles/organiations.scss"
import AddIcon from "./assets/add.svg"
import { OrganizationTable } from "../../components/table/OrganizationTable";
import Button from "../../components/button";
import { changeRoute } from "../../store/currentPage/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Loader } from "../../components/loader";
import Headline from "../../components/page-title/index";
import { getAllOrganization } from '../../store/organization/actions';
import { RootState } from '../../store';

export const Organizations: React.FunctionComponent = (props) => {
    const organizations = useSelector((state: RootState) => state.organization.all)
    const dispatch = useDispatch();
    const history = useHistory()

    const createNew = () => {
        dispatch(changeRoute('apps/organizations/new-organization'))
        history.push('/apps/organizations/new-organization')
    }

    useEffect(() => {
        !organizations.length && dispatch(getAllOrganization())
    }, [organizations])

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

                {organizations.length 
                    ? <OrganizationTable rows={organizations} /> 
                    : (<div className='organization-table-loader'><Loader /></div>)
                }
            </div>
        </section>
    )
}
