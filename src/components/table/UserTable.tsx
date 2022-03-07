import React, { FunctionComponent, useEffect, useLayoutEffect, useMemo, useState } from "react";

import EditSVG from "./assets/edit-row-icon.svg";

import { EditProfile } from "../edit-modal/edit-profile";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";
import { adaptRoles } from "../../services/baseService";
import ComaList from "../coma-list";
import { IUpdateUser } from "../../types/user";
import ISort from "../../types/sort-type";
import { useGetOrganizationUsersQuery } from "../../api/user";
import "./styles/table.scss";
import { USER_HEADER } from "./utils/constants";
import { SortDirection } from "../../data/enum";

interface UserTableProps {
    orgId: string;
}

export const UserTable: FunctionComponent<UserTableProps> = ({ orgId }) => {
    // ? Need to be in component to reset sort after update
    const INITIAL_SORT = { name: "", direction: SortDirection.Default }

    const { data, isSuccess } = useGetOrganizationUsersQuery(orgId);

    const [localRows, setLocalRows] = useState<IUpdateUser[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);

    const [sort, setSort] = useState<ISort>(INITIAL_SORT);
    const [user, setUser] = useState<IUpdateUser>();

    const [scrollY, setScrollY] = useState<number>(0); 

    const endDates = useMemo(() => {
        if (data) {
            const result = new Map;

            data.map((user) => {
                result.set(
                    user.id,
                    user.subscriptionEndDate.split(" ")[0]
                )
            })
            return result
        }
    }, [data])

    useEffect(() => {
        if (isSuccess && data) {
            const usersWithDate = data.map(user => (
                { ...user, subscriptionEndDate: new Date(user.subscriptionEndDate) }
            ))
            sessionStorage.setItem('table-rows', JSON.stringify(usersWithDate))
            setLocalRows(usersWithDate);
            setSort(INITIAL_SORT);
        }
    }, [isSuccess, data])

    // ? Kludge for Chrome to remember scroll position after rerendering

    useLayoutEffect(() => {
        const scrollWrapper = document.querySelector('main')
        if (scrollWrapper) {
            scrollWrapper.scrollTop = scrollY;
        }
    }, [localRows])


    return (
        <>
            <table
                className="table table--user"
            >
                <thead className="table__head">
                    <tr className="table__header">
                        {USER_HEADER.keys.map((key: string, index: number) =>
                        (<SortTableHeader
                            key={key}
                            name={key}
                            text={USER_HEADER.titles[index]}
                            sort={sort}
                            localRows={localRows}
                            setSort={setSort}
                            setLocalRows={setLocalRows}
                            className="user"
                            rememberScroll={setScrollY}
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
                                {endDates?.get(user.id)}
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && (
                <EditProfile
                    user={user as IUpdateUser}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};
