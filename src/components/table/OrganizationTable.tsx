import React, {useState, useEffect} from "react";
import "./styles/table.scss"
import {useHistory} from "react-router-dom";
import {IRow} from "../../types/table/types";
import {SVG} from "../SVG";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";

import editSVG from './assets/edit-row-icon.svg'
import deleteSVG from './assets/delete-row-icon.svg'

import classNames from "classnames";
import {useDispatch} from "react-redux";
import {changeRoute} from "../../store/currentPage/actions";
import {network} from "../../services/networkService";

interface ITable {
    rows: IRow[]
    inEdit?: boolean
}

const enum OrganizationKey {
    id = 'id',
    name ='name',
    idCRM = 'customerCrmId',
    linkCRM = 'customerCrmLink',
    comments = 'comments',
    assets = 'assets',
}

export const OrganizationTable: React.FunctionComponent<ITable> = (props) => {
    const { rows } = props;
    const history = useHistory()
    const dispatch = useDispatch();

    const [localRows, setLocalRows] = useState<IRow[]>(rows)
    const [itemDeleting, setItemDeleting] = useState<number | null>(null)
    const [sort, setSort] = useState<any>({name: '', direction: 'none'})

    const handleEditRoute = (route: string, id: string) => {
        dispatch(changeRoute(route))
        history.push('/')
        history.push('/' + route + `/${id}`)
    }

    useEffect(()=> {
        localStorage.setItem('rows', JSON.stringify(props.rows))
    }, [props.rows])

    const handleDeleteOrganization = (id: string, index: number) => {
        console.log('delete', id)
        setItemDeleting(index)
        network.delete('api/Organization/delete', {id})
            .then((r: any) => {
                console.log('result', r)
                setItemDeleting(null)
                setLocalRows(localRows.filter(rowItem => rowItem.row.id !== id))
            })
            .catch((e: any) => {
                console.log(e.data)
            })
    }

    if(!localRows) return null

    return(
        <div className="table">
            <div className="table-head">
                <div className="table-head-row">
                    <SortTableHeader 
                        name={OrganizationKey.name} text='Organization Name'  
                        sort={sort} localRows={localRows} setSort={setSort} setLocalRows={setLocalRows}  
                    />

                    <SortTableHeader 
                        name={OrganizationKey.idCRM} text='CRM Customer ID '  
                        sort={sort} localRows={localRows} setSort={setSort} setLocalRows={setLocalRows}  
                    />

                    <SortTableHeader 
                        name={OrganizationKey.linkCRM} text='CRM Customer link'  
                        sort={sort} localRows={localRows} setSort={setSort} setLocalRows={setLocalRows}  
                    />

                    <SortTableHeader 
                        name={OrganizationKey.comments} text='Comments'  
                        sort={sort} localRows={localRows} setSort={setSort} setLocalRows={setLocalRows}  
                    />
                </div>
            </div>
            <div className="table-body">
                {localRows.map((row, index) => (
                    <div className={classNames("table-body-row", {deleting: index === itemDeleting})} key={index}>
                        <div className="table-body-item">
                            {row.row.name}
                        </div>
                        <div className="table-body-item">
                            {row.row.customerCrmId}
                        </div>
                        <div className="table-body-item">
                            <a href={row.row.customerCrmLink}>{row.row.customerCrmLink}</a>
                        </div>
                        <div className="table-body-item">
                            {row.row.comments}
                        </div>
                        <div className='table-body-row__actions'>
                            <SVG icon={editSVG}
                                onClick={() => handleEditRoute("apps/organizations", row.row.id)}/>
                            <SVG icon={deleteSVG} onClick={() => handleDeleteOrganization(row.row.id, index)}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
