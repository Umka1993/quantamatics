import React, { useState, useEffect } from "react";
import "./styles/table.scss";
import { IUserRow } from "../../types/table/types";
import EditSVG from "./assets/edit-row-icon.svg";
import DeleteSVG from "./assets/delete-row-icon.svg";
import { EditProfile } from "../edit-modal/edit-profile";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";

import { USER } from "../../contstans/constans";

import { formatDate, adaptRoles } from "../../services/baseService";
import ComaList from "../coma-list";
import { IUser } from "../../types/user";
import ISort from "../../types/sort-type";
import { SortDirection } from "../../data/enum";
import { useGetOrganizationUsersQuery } from "../../api";
import { useParams } from "react-router";
import { RouteParams } from "types/route-params";
import Loader from "../loader";

interface ITable {
    inEdit?: boolean;
    deleteUser: Function;
}

export const UserTable: React.FunctionComponent<ITable> = (props) => {
    const { deleteUser } = props;

    const { id } = useParams<RouteParams>();

    const { data, isSuccess, isLoading } = useGetOrganizationUsersQuery(id);

    const [localRows, setLocalRows] = useState<IUser[]>([]);
    const [showModal, setShowModal] = useState<Boolean>(false);
    const [sort, setSort] = useState<ISort>({
        name: "",
        direction: SortDirection.Default,
    });

    const [user, setUser] = useState<any>(USER);

    useEffect(() => {
        sort.direction === SortDirection.Default &&
            isSuccess &&
            setLocalRows(data as IUser[]);
    }, [sort, isSuccess]);

    const handleEditUser = (user: any, index: number) => {
        setUser(user);
        setShowModal(true);
    };

    const updateUsers = (user: any) => {
        const newRows = localRows;

        user.subscriptionEndDate = new Date(
            user.subscriptionEndDate
        ).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });

        if (user.newEmail) {
            user.email = user.newEmail;
        }

        // newRows[editIndex].row = user
        setLocalRows(newRows);
    };

    const handleDeleteUser = (data: IUserRow) => {
        deleteUser(data.row.id);
    };

    if (isLoading) {
        return (
            <div className="user-table-loader">
                <Loader />
            </div>
        );
    }

    return (
        <>
            <table className="table table--user">
                <thead className="table__head">
                    <tr className="table__header">
                        <SortTableHeader
                            name="firstName"
                            text="First Name"
                            sort={sort}
                            localRows={localRows}
                            setSort={setSort}
                            setLocalRows={setLocalRows}
                            className="user"
                        />

                        <SortTableHeader
                            name="lastName"
                            text="Last Name"
                            sort={sort}
                            localRows={localRows}
                            setSort={setSort}
                            setLocalRows={setLocalRows}
                            className="user"
                        />

                        <SortTableHeader
                            name="email"
                            text="Email"
                            sort={sort}
                            localRows={localRows}
                            setSort={setSort}
                            setLocalRows={setLocalRows}
                            className="user"
                        />

                        <SortTableHeader
                            name="subscriptionEndDate"
                            text="Expiration Date"
                            sort={sort}
                            localRows={localRows}
                            setSort={setSort}
                            setLocalRows={setLocalRows}
                            className="user"
                        />
                        <SortTableHeader
                            name="userRoles"
                            text="User Role"
                            sort={sort}
                            localRows={localRows}
                            setSort={setSort}
                            setLocalRows={setLocalRows}
                            className="user"
                        />
                        <th className="table__headline table__headline--hidden">Actions</th>
                    </tr>
                </thead>
                <tbody className="table__body">
                    {localRows.map((user, index) => (
                        <tr className="table__row" key={user.id}>
                            <td className="table__cell">{user.firstName}</td>
                            <td className="table__cell">{user.lastName}</td>
                            <td className="table__cell">{user.email}</td>
                            <td className="table__cell">
                                {formatDate(user.subscriptionEndDate)}
                            </td>
                            <td className="table__cell">
                                <ComaList list={adaptRoles(user.userRoles)} />
                            </td>
                            <td className="table__cell table__cell--actions">
                                <button
                                    type="button"
                                    className="table__action"
                                    onClick={() => {
                                        handleEditUser(user, index);
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
                    user={user}
                    onClose={() => setShowModal(false)}
                    onSubmit={updateUsers}
                />
            )}
        </>
    );
};
