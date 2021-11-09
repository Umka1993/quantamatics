import React, { useState, useEffect } from "react";
import "./styles/table.scss"
import { IUserRow } from "../../types/table/types";
import { SVG } from "../SVG";
import EditSVG from "./assets/edit-row-icon.svg";
import DeleteSVG from "./assets/delete-row-icon.svg";
import { EditProfile } from "../edit-modal/edit-profile";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";

import { USER } from "../../contstans/constans";

import { formatDate } from "../../services/baseService"
import ComaList from "../coma-list";
import { IUser } from "types/edit-profile/types";

interface ITable {
    rows: IUserRow[]
    inEdit?: boolean,
    deleteUser: Function,
}

export const UserTable: React.FunctionComponent<ITable> = (props) => {
    const { rows, deleteUser } = props;
    console.table(rows);

    const [localRows, setLocalRows] = useState<IUserRow[]>(rows)
    const [showModal, setShowModal] = useState<Boolean>(false)
    const [sort, setSort] = useState<any>({ name: '', direction: 'none' })

    const [user, setUser] = useState<any>(USER)

    const [editIndex, setEditIndex] = useState<number>(-1);

    useEffect(() => {
        localStorage.setItem('rows', JSON.stringify(rows))
    }, [rows])

    const handleEditUser = (user: any, index: number) => {
        setEditIndex(index)
        setUser(user.row)
        setShowModal(true)
    }

    const updateUsers = (user: any) => {
        const newRows = localRows;

        user.subscriptionEndDate = new Date(user.subscriptionEndDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })

        if (user.newEmail) {
            user.email = user.newEmail
        }


        newRows[editIndex].row = user
        setLocalRows(newRows)
    }

    const handleDeleteUser = (data: IUserRow) => {
        deleteUser(data.row.id);
    }

    return (
        <>
            <table className="table table--user">
                <thead className="table__head">
                    <tr className="table__header">
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
                            name="subscriptionEndDate" text="Expiration Date"
                            sort={sort} localRows={localRows} setSort={setSort} setLocalRows={setLocalRows}
                            className="user"
                        />
                        <SortTableHeader
                            name="" text="User Role"
                            sort={sort} localRows={localRows} setSort={setSort} setLocalRows={setLocalRows}
                            className="user"
                        />
                        <th className='table__headline table__headline--hidden'>Actions</th>
                    </tr>
                </thead>
                <tbody className="table__body">
                    {localRows.map((row, index) => (
                        <tr className="table__row" key={row.row.id}>
                            <td className="table__cell">
                                {row.row.firstName}
                            </td>
                            <td className="table__cell">
                                {row.row.lastName}
                            </td>
                            <td className="table__cell">
                                {row.row.email}
                            </td>
                            <td className="table__cell">
                                {formatDate(row.row.subscriptionEndDate)}
                            </td>
                            <td className="table__cell">
                                <ComaList list={row.row.userRoles} />
                            </td>
                            <td className='table__cell table__cell--actions'>
                                <button
                                    type='button'
                                    className='table__action'
                                    onClick={() => { handleEditUser(row, index) }}
                                >
                                    <EditSVG role="img" aria-label="edit" fill="currentColor" />
                                </button>
                                <button
                                    type='button'
                                    className='table__action'
                                    // onClick={() => { handleDeleteUser(row) }}
                                    disabled
                                >
                                    <DeleteSVG role="img" aria-label="delete" fill="currentColor" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal &&
                <EditProfile user={user} onClose={() => setShowModal(false)} onSubmit={updateUsers} />
            }
        </>
    )
}


