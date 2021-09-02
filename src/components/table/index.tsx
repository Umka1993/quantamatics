import React, {useState, useCallback} from "react";
import "./styles/table.scss"
import {IRow} from "../../types/table/types";
import {Modal} from "../modal";
import {Input} from "../input";


interface ITable {
   rows: IRow[]
}

export const Table: React.FunctionComponent<ITable> = (props) => {
    const { rows } = props;

    const [localRows, setLocalRows] = useState<IRow[]>(rows)
    const [showModal, setShowModal] = useState<number | null>(null)
    const [organizationName, setOrganizationName] = useState<string>('')
    const [customerID, setCustomerID] = useState<string>('')
    const [customerLink, setCustomerLink] = useState<string>('')
    const [comment, setComment] = useState<string | undefined>('')

    const editOrganization = useCallback((index: number) => {
        let row = localRows[index]
        row.organization = organizationName || row.organization
        row.customerId = customerID || row.customerId
        row.customerLink = customerLink || row.customerLink
        row.comments = comment || row.comments
        console.log(organizationName)
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
        setOrganizationName(localRows[index].organization)
        setCustomerID(localRows[index].customerId)
        setCustomerLink(localRows[index].customerLink)
        setComment(localRows[index].comments)
        setShowModal(index + 1)
    }, [])

    return(
        <div className="table">
            <div className="table-head">
                <div className="table-head-row">
                    <div className="table-head-item">
                        ORGANIZATION Name
                    </div>
                    <div className="table-head-item">
                        CRM Customer ID
                    </div>
                    <div className="table-head-item">
                        comments
                    </div>
                </div>
            </div>
            <div className="table-body">
                {localRows.map((row, index) => (
                    <div className="table-body-row" key={index}>
                        <div className="table-body-item">
                            {row.organization}
                        </div>
                        <div className="table-body-item">
                            <span><a href={row.customerLink}>{row.customerId}</a></span>
                        </div>
                        <div className="table-body-item">
                            {row.comments}
                        </div>
                        <div className='dots-container' onClick={() => openModal(index)}>
                            <div className="dot"/>
                            <div className="dot"/>
                            <div className="dot"/>
                        </div>
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