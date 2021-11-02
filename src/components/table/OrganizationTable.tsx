import React, {useState, useEffect} from "react";
import "./styles/table.scss"
import {useHistory} from "react-router-dom";
import {IRow} from "../../types/table/types";
import {SVG} from "../SVG";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";

import EditSVG from './assets/edit-row-icon.svg'
import DeleteSVG from './assets/delete-row-icon.svg'

import classNames from "classnames";
import {useDispatch} from "react-redux";
import {changeRoute} from "../../store/currentPage/actions";
// import {network} from "../../services/networkService";

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

    // ? For the future use

    /* const handleDeleteOrganization = (id: string, index: number) => {
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
    } */

    if(!localRows) return null

    return(
        <table className="table table--organization">
            <thead className="table__head">
                <tr className="table__header">
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

                    <th className='table__headline table__headline--hidden'>Actions</th>
                </tr>
            </thead>
            <tbody className="table__body">
                {localRows.map((row, index) => (
                    <tr className={classNames("table__row", {deleting: index === itemDeleting})} key={index}>
                        <td className="table__cell">
                            {row.row.name}
                        </td>
                        <td className="table__cell">
                            {row.row.customerCrmId}
                        </td>
                        <td className="table__cell">
                            <a href={row.row.customerCrmLink} target="_blank" rel="noopener noreferrer">{row.row.customerCrmLink}</a>
                        </td>
                        <td className="table__cell table__cell--comment">
                            {row.row.comments}
                        </td>
                        <td className='table__cell table__cell--actions'>
                            <button 
                                className='table__action'
                                onClick={() => handleEditRoute("apps/organizations", row.row.id)}
                            >
                                <EditSVG role="img" aria-label="edit" fill="currentColor" />
                            </button>
                            <button 
                                className='table__action'
                                // onClick={() => handleDeleteOrganization(row.row.id, index)}
                                disabled
                            >
                                <DeleteSVG role="img" aria-label="delete" fill="currentColor" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
