import React, {useEffect} from 'react';
import {network} from "../../services/networkService";
import "./styles/organiations.scss"
import addIcon from "./assets/add.svg"
import {OrganizationTable} from "../../components/table/OrganizationTable";
import {TABLE_ITEMS} from "../../contstans/constans";
import {Button} from "../../components/button/button";
import {changeRoute} from "../../store/currentPage/actions";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";


export const Organizations: React.FunctionComponent = (props) => {
    const dispatch = useDispatch();
    const history = useHistory()

    const fetchOrganizations = () => {
        network.get('api/Organization/getAll')
            .then((r: any) => {
                console.log(r.data)
            })
            .catch((e: any) => {
                console.log(e.data)
            })
    }

    const createNew = () => {
        dispatch(changeRoute('apps/organizations/new-organization'))
        history.push('/apps/organizations/new-organization')
    }

    useEffect(() => {
        fetchOrganizations()
    })

    return(
        <div className="organization">
            <div className="organization__list">
                <div className="organization__header">
                    <div className="organization__titles">
                        <h1>List of Organizations</h1>
                        <p>Create and customize organizations for future owners</p>
                    </div>
                    <div className="organization__btn" onClick={() => createNew()}>
                        <Button type={'simple'} text={'Add New'} icon={addIcon}/>
                    </div>
                </div>
                <OrganizationTable rows={TABLE_ITEMS} />
            </div>
        </div>
    )
}
