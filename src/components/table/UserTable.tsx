import React, {useState, useCallback, useEffect} from "react";
import "./styles/table.scss"
import {IUserRow} from "../../types/table/types";
import {Modal} from "../modal";
import {Input} from "../input";
import {SVG} from "../SVG";
import sortNoneSVG from './assets/sort-none.svg'
import sortActiveSVG from './assets/sort-active.svg'
import classNames from "classnames";
import {sortTable} from "../../services/baseService";


interface ITable {
    rows: IUserRow[]
    inEdit?: boolean
}

export const UserTable: React.FunctionComponent<ITable> = (props) => {
    const { rows } = props;
    const [localRows, setLocalRows] = useState<IUserRow[]>(rows)
    const [showModal, setShowModal] = useState<number | null>(null)
    const [sort, setSort] = useState<any>({name: '', direction: 'none'})

    useEffect(()=> {
        localStorage.setItem('rows', JSON.stringify(props.rows))
    }, [props.rows])

    const edit = useCallback((index: number) => {
        setShowModal(null)
    }, [])

    const openModal = useCallback((index: number) => {
        setShowModal(index + 1)
    }, [])

    return(
        <div className="table user">
            <div className="table-head">
                <div className="table-head-row">
                    <div className={classNames("table-head-item user", {desc: sort.direction === 'desc'})}
                         onClick={() => sortTable('firstName', sort, localRows, setSort, setLocalRows) }
                    >
                        First Name <SVG icon={sort.name === 'firstName' ? sortActiveSVG : sortNoneSVG} />
                    </div>
                    <div className={classNames("table-head-item user", {desc: sort.direction === 'desc'})}
                         onClick={() => sortTable('lastName', sort, localRows, setSort, setLocalRows) }
                    >
                        Last Name <SVG icon={sort.name === 'lastName' ? sortActiveSVG : sortNoneSVG} />
                    </div>
                    <div className={classNames("table-head-item user", {desc: sort.direction === 'desc'})}
                         onClick={() => sortTable('email', sort, localRows, setSort, setLocalRows)}
                    >
                        Email <SVG icon={sort.name === 'email' ? sortActiveSVG : sortNoneSVG} />
                    </div>
                    <div className={classNames("table-head-item user", {desc: sort.direction === 'desc'})}
                         onClick={() => sortTable('expirationDate', sort, localRows, setSort, setLocalRows)}
                    >
                        Expiration Date <SVG icon={sort.name === 'expirationDate' ? sortActiveSVG : sortNoneSVG} />
                    </div>
                </div>
            </div>
            <div className="table-body">
                {localRows.map((row, index) => (
                    <div className="table-body-row" key={index}>
                        <div className="table-body-item user">
                            {row.row.firstName}
                        </div>
                        <div className="table-body-item user">
                            {row.row.lastName}
                        </div>
                        <div className="table-body-item user">
                            {row.row.email}
                        </div>
                        <div className="table-body-item user">
                            {row.row.expirationDate}
                        </div>
                        <div className='user dots-container' onClick={() => openModal(index)}>
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
                      onChangeInput={(value)=>console.log(value)}
                      placeholder='Name of The Organization'
                      value=''
                    />
                    <Input
                      onChangeInput={(value)=>console.log(value)}
                      placeholder='CRM Customer ID'
                      value=''
                    />
                    <Input
                      onChangeInput={(value)=>console.log(value)}
                      placeholder='CRM Customer ID Link'
                      value=''
                    />
                    <Input
                      onChangeInput={(value)=>console.log(value)}
                      placeholder='Comments'
                      value=''
                    />
                    <div className='table-edit-organization-modal__submit' onClick={() => edit(showModal-1)}>save</div>
                </Modal>
            }
        </div>
    )
}