import React, { useState, useEffect } from "react";

import EditSVG from "./assets/edit-row-icon.svg";
import DeleteSVG from "./assets/delete-row-icon.svg";

import { EditProfile } from "../edit-modal/edit-profile";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";
import { adaptRoles } from "../../services/baseService";
import ComaList from "../coma-list";
import { IUser } from "../../types/user";
import ISort from "../../types/sort-type";
import { SortDirection, UserKey } from "../../data/enum";
import { useGetOrganizationUsersQuery } from "../../api/user";
import { useParams } from "react-router";
import { RouteParams } from "types/route-params";
import Loader from "../loader";

import "./styles/table.scss";

interface ITable {
}

export const UserTable: React.FunctionComponent<ITable> = () => {
    const { id } = useParams<RouteParams>();

    const { data, isSuccess, isLoading } = useGetOrganizationUsersQuery(id);

    const [localRows, setLocalRows] = useState<IUser[]>([]);
    const [showModal, setShowModal] = useState<Boolean>(false);

    const initialSort = { name: "", direction: SortDirection.Default }
    const [sort, setSort] = useState<ISort>(initialSort);

    const [user, setUser] = useState<IUser>();

    useEffect(() => {        
        if (isSuccess) {
            setLocalRows(data as IUser[]);
            setSort(initialSort);
        }
    }, [isSuccess, data])

    /* const handleDeleteUser = (data: IUserRow) => {
    }; */

    if (isLoading) {
        return (
            <div className="user-table-loader">
                <Loader />
            </div>
        );
    }

    const tableTitles = ["First Name", "Last Name", "Email", "Expiration Date", "Organization Role"];

    const tableTitlesKeys = [UserKey.Name, UserKey.Surname, UserKey.Email, UserKey.SubscriptionEndDate, UserKey.UserRoles];


    return (
        <>
            <table className="table table--user">
                <thead className="table__head">
                    <tr className="table__header">
                        {tableTitles.map((title: string, index: number) =>
                        (<SortTableHeader
                            key={title}
                            name={tableTitlesKeys[index]}
                            text={title}
                            sort={sort}
                            localRows={localRows}
                            setSort={setSort}
                            setLocalRows={setLocalRows}
                            className="user"
                        />))
                        }
                        <th className="table__headline table__headline--hidden">Actions</th>
                    </tr>
                </thead>
                <tbody className="table__body">
                    {localRows.map((user) => (
                        <tr className="table__row" key={user.id}>
                            <td className="table__cell">{user.firstName}</td>
                            <td className="table__cell">{user.lastName}</td>
                            <td className="table__cell">{user.email}</td>
                            <td className="table__cell">
                                {user.subscriptionEndDate.split(' ')[0]}
                            </td>
                            <td className="table__cell">
                                <ComaList list={adaptRoles(user.userRoles)} />
                            </td>
                            <td className="table__cell table__cell--actions">
                                <button
                                    type="button"
                                    className="table__action"
                                    onClick={() => {
                                        setUser(user);
                                        setShowModal(true);
                                    }}
                                >
                                    <EditSVG role="img" aria-label="edit" fill="currentColor" />
                                </button>
                                <button
                                    type="button"
                                    className="table__action"
                                    // onClick={() => { handleDeleteUser(row) }}
                                    disabled
                                >
                                    <DeleteSVG
                                        role="img"
                                        aria-label="delete"
                                        fill="currentColor"
                                    />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && (
                <EditProfile
                    user={user as IUser}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};
