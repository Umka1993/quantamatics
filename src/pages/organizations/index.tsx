import React, { useEffect, useState } from 'react';
import "./styles/organiations.scss"
import AddIcon from "./assets/add.svg"
import { OrganizationTable } from "../../components/table/OrganizationTable";
import Button from "../../components/button";
import { changeRoute } from "../../store/currentPage/actions";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Loader } from "../../components/loader";
import Headline from "../../components/page-title/index";
import { getAllOrganization } from '../../store/organization/actions';

export const Organizations: React.FunctionComponent = (props) => {
    const [organizations, setOrganizations] = useState<any>()
    const dispatch = useDispatch();
    const history = useHistory()

    const onFinishGetAll = (r: any) => {

        let result = r.data.map((row: any) => {
            return {
                editable: true,
                row
            }
        })
        console.log('result', result)
        setOrganizations(result)
    }

    const onErrorGetAll = (e: any) => {
        console.log(e.data)
    }

    const createNew = () => {
        dispatch(changeRoute('apps/organizations/new-organization'))
        history.push('/apps/organizations/new-organization')
    }

    useEffect(() => {
        if (!organizations) dispatch(getAllOrganization(onFinishGetAll, onErrorGetAll))
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

                {!!organizations ? <OrganizationTable rows={organizations} /> : (<div className='organization-table-loader'><Loader /></div>)}
            </div>
        </section>
    )
}
