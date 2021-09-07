import React, {useState, useCallback, useEffect} from "react";
import "./styles/table.scss"
import {useHistory} from "react-router-dom";
import {IRow} from "../../types/table/types";
import {Modal} from "../modal";
import {Input} from "../input";
import {SVG} from "../SVG";

import editSVG from './assets/edit-row-icon.svg'
import deleteSVG from './assets/delete-row-icon.svg'
import sortNoneSVG from './assets/sort-none.svg'
import sortActiveSVG from './assets/sort-active.svg'
import classNames from "classnames";


interface ITable {
    rows: IRow[]
    inEdit?: boolean
}

export const Table: React.FunctionComponent<ITable> = (props) => {
    const { rows, inEdit } = props;
    const history = useHistory();
    const [localRows, setLocalRows] = useState<IRow[]>(rows)
    const [showModal, setShowModal] = useState<number | null>(null)
    const [organizationName, setOrganizationName] = useState<string>('')
    const [customerID, setCustomerID] = useState<string>('')
    const [customerLink, setCustomerLink] = useState<string>('')
    const [comment, setComment] = useState<string | undefined>('')
    const [sort, setSort] = useState<any>({name: '', direction: 'none'})
    useEffect(()=> {
        localStorage.setItem('rows', JSON.stringify(props.rows))
    }, [props.rows])
    const sortTable = useCallback((name: string)=>{
        let newSort = sort
        if (name === sort.name) {
            if(sort.direction === 'none') {
                newSort.direction = 'asc'
            }
            else if(sort.direction === 'asc') {
                newSort.direction = 'desc'
            }
            else if(sort.direction === 'desc') {
                newSort.direction = 'none'
                newSort.name = ''
            }
        } else {
            newSort.direction = 'asc'
            newSort.name = name
        }

        let newRows = localRows
        if(newSort.direction === 'asc') {
            newRows.sort((a:any,b:any) => (a.row[name] > b.row[name]) ? 1 : ((b.row[name] > a.row[name]) ? -1 : 0))
        }else if (newSort.direction === 'desc') {
            newRows.sort((a:any,b:any) => (b.row[name] > a.row[name]) ? 1 : ((a.row[name] > b.row[name]) ? -1 : 0))
        } else if (newSort.direction === 'none') {
            newRows = localStorage.getItem('rows') ? JSON.parse(localStorage.getItem('rows') as string) : props.rows
        }

        setSort({name: newSort.name, direction: newSort.direction})
        setLocalRows(newRows)
    }, [sort, localRows])

    const editOrganization = useCallback((index: number) => {
        let row = localRows[index]
        row.row.organization = organizationName || row.row.organization
        row.row.customerId = customerID || row.row.customerId
        row.row.customerLink = customerLink || row.row.customerLink
        row.row.comments = comment || row.row.comments

        localRows[index] = row
        setLocalRows(localRows)
        setOrganizationName('')
        setCustomerID('')
        setCustomerLink('')
        setComment('')
        setShowModal(null)
    }, [organizationName, customerID, customerLink, comment])

    const openModal = useCallback((index: number) => {
        setLocalRows(localRows)
        setOrganizationName(localRows[index].row.organization)
        setCustomerID(localRows[index].row.customerId)
        setCustomerLink(localRows[index].row.customerLink)
        setComment(localRows[index].row.comments)
        setShowModal(index + 1)
    }, [])

    return(
        <div className="table">
            <div className="table-head">
                <div className="table-head-row">
                    <div className={classNames("table-head-item", {desc: sort.direction === 'desc'})} onClick={() => sortTable('organization') }>
                        ORGANIZATION Name <SVG icon={sort.name === 'organization' ? sortActiveSVG : sortNoneSVG} />
                    </div>
                    <div className={classNames("table-head-item", {desc: sort.direction === 'desc'})} onClick={() => sortTable('customerId') }>
                        CRM Customer ID <SVG icon={sort.name === 'customerId' ? sortActiveSVG : sortNoneSVG} />
                    </div>
                    <div className={classNames("table-head-item", {desc: sort.direction === 'desc'})} onClick={() => sortTable('comments')}>
                        comments <SVG icon={sort.name === 'comments' ? sortActiveSVG : sortNoneSVG} />
                    </div>
                </div>
            </div>
            <div className="table-body">
                {localRows.map((row, index) => (
                    <div className="table-body-row" key={index}>
                        <div className="table-body-item">
                            {row.row.organization}
                        </div>
                        <div className="table-body-item">
                            <span><a href={row.row.customerLink}>{row.row.customerId}</a></span>
                        </div>
                        <div className="table-body-item">
                            {row.row.comments}
                        </div>
                        {inEdit ? (
                            <div className='dots-container' onClick={() => openModal(index)}>
                                <div className="dot"/>
                                <div className="dot"/>
                                <div className="dot"/>
                            </div>
                        ) : (
                            row.editable && (
                                <div className='table-body-row__actions'>
                                    <SVG icon={editSVG} onClick={() => history.push("/organization-edit")}/>
                                    <SVG icon={deleteSVG} />
                                </div>
                            )
                        )}
                    </div>
                ))}
            </div>
            {!!showModal &&
                <Modal className='table-edit-organization-modal' onClose={() => setShowModal(null)} width={468}>
                    <div className='table-edit-organization-modal__title'>Edit Organization</div>
                    <Input
                      onChangeInput={(value)=>setOrganizationName(value)}
                      placeholder='Name of The Organization'
                      value={organizationName}
                    />
                    <Input
                      onChangeInput={(value)=>setCustomerID(value)}
                      placeholder='CRM Customer ID'
                      value={customerID}
                    />
                    <Input
                      onChangeInput={(value)=>setCustomerLink(value)}
                      placeholder='CRM Customer ID Link'
                      value={customerLink}
                    />
                    <Input
                      onChangeInput={(value)=>setComment(value)}
                      placeholder='Comments'
                      value={comment}
                    />
                    <div className='table-edit-organization-modal__submit' onClick={() => editOrganization(showModal-1)}>save</div>
                </Modal>
            }
        </div>
    )
}