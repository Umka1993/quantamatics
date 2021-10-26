import React, { useState, useEffect } from "react";
import "./styles/table.scss"
import { IUserRow } from "../../types/table/types";
import { SVG } from "../SVG";
import editSVG from "./assets/edit-row-icon.svg";
import deleteSVG from "./assets/delete-row-icon.svg";
import { EditProfile } from "../edit-profile";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";

import { USER } from "../../contstans/constans";

interface ITable {
    rows: IUserRow[]
    inEdit?: boolean,
    deleteUser: Function,
}

export const UserTable: React.FunctionComponent<ITable> = (props) => {
    const { rows, deleteUser } = props;
    const [localRows, setLocalRows] = useState<IUserRow[]>(rows)
    const [showModal, setShowModal] = useState<Boolean>(false)
    const [sort, setSort] = useState<any>({ name: '', direction: 'none' })

    const [user, setUser] = useState<any>(USER)

    useEffect(() => {
        localStorage.setItem('rows', JSON.stringify(rows))
    }, [rows])

    const handleEditUser = (user: any) => {
        setUser(user.row)
        setShowModal(true)
    }

    const handleDeleteUser = (data : IUserRow) => {
        deleteUser(data.row.id);
    }

    return (
        <div className="table user">
            <div className="table-head">
                <div className="table-head-row">
                    <SortTableHeader 
                        name="firstName" text="First Name"  
                        sort={sort} localRows={localRows} setSort={setSort} setLocalRows={setLocalRows}  
                        className="user"
                    />

                    <SortTableHeader 
                        name="lastName" text="Last Name"  
                        sort={sort} localRows={localRows} setSort={setSort} setLocalRows={setLocalRows}  
                        className="user"
                    />

                    <SortTableHeader 
                        name="email" text="Email"  
                        sort={sort} localRows={localRows} setSort={setSort} setLocalRows={setLocalRows}  
                        className="user"
                    />

                    <SortTableHeader 
                        name="expirationDate" text="Expiration Date"  
                        sort={sort} localRows={localRows} setSort={setSort} setLocalRows={setLocalRows}  
                        className="user"
                    />

                </div>
            </div>
            <div className="table-body">
                {localRows.map((row) => (
                    <div className="table-body-row" key={row.row.id}>
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
                            {formatDate(row.row.subscriptionEndDate)}
                        </div>
                        <div className='table-body-row__actions'>
                            <SVG icon={editSVG} onClick={() => { handleEditUser(row) }} />
                            <SVG icon={deleteSVG} onClick={() => {handleDeleteUser(row)}} className='disabled' />
                        </div>
                    </div>
                ))}
            </div>
            {showModal && <EditProfile user={user} type_edit={true} onClose={() => setShowModal(false)} />}
        </div>
    )
}


function formatDate(date: string): string {
    let result = date.split(' ')[0];
    return result.replace(/[/]/g, '.');
}