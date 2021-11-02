import React, { useCallback, useEffect, useState } from "react";
import "./styles/edit-organizations.scss"
import addIcon from "./assets/human-add.svg"
import { Button } from "../button/button";
import { UserTable } from "../table/UserTable";
import { AddUserAccount } from "../add-user-account";
import { Input } from "../input";
import { useHistory, useParams } from "react-router-dom";
import { network } from "../../services/networkService";
import { changeRoute } from "../../store/currentPage/actions";
import { useDispatch } from "react-redux";
import Headline from "../page-title/index";
import type { IUserRow } from "types/table/types";


type RouteParams = {
    id: string;
}

export const EditOrganization: React.FunctionComponent = (props) => {
    const [organizationName, setOrganizationName] = useState<string>('')
    const [customerID, setCustomerID] = useState<string>('')
    const [customerLink, setCustomerLink] = useState<string>('')
    const [comment, setComment] = useState<string | undefined>('')
    const [users, setUsers] = useState<any>(null)
    const [organization, setOrganization] = useState<any>(null)

    const { id: orgId } = useParams<RouteParams>();

    const dispatch = useDispatch();
    const history = useHistory();
    const [addUserActive, setAddUserActive] = useState<Boolean>(false)

    const fetchUsers = () => {
        network.get('api/User/list', { orgId })
            .then((r: any) => {

                let result = r.data.map((row: any) => {
                    
                    return {
                        editable: true,
                        row
                    }
                })
                setUsers(result)
            })
            .catch((e: any) => {
                console.log(e.data)
            })
    }

    const deleteUser = (id: number) => {
        // TODO: Delete user

        console.log(`Guy #${id} bust be deleted`)
        // console.table(users.filter(({row}: IUserRow) => row.id !== id ))
        /* network.post('api/Admin/updateUserOrg', { userId: id })
            .then((r: any) => {

                // let result = r.data.map((row: any) => {
                //     return {
                //         editable: true,
                //         row
                //     }
                // })
                console.log('users result', r)
                // setUsers(result)
            })
            .catch((e: any) => {
                console.log(e)
                console.log(e.data)
            }) */
    }

    const fetchOrganization = () => {
        network.get('api/Organization/get', { id: orgId })
            .then((r: any) => {

                dispatch(changeRoute(`apps/organizations/${r.data.name}`))
                setOrganization(r.data)
                setOrganizationName(r.data.name)
                setCustomerID(r.data.customerCrmId)
                setCustomerLink(r.data.customerCrmLink)
                setComment(r.data.comments)
                // setUsers(result)
            })
            .catch((e: any) => {
                console.log(e.data)
            })
    }

    const updateOrganization = useCallback(() => {
        if (organizationName && customerID && customerLink) {
            network.put('api/Organization/update', {
                id: orgId,
                name: organizationName,
                customerCrmId: customerID,
                customerCrmLink: customerLink,
                comments: comment,
            })
                .then((r: any) => {
                    console.log(r)
                    dispatch(changeRoute("/apps/organizations/list"))
                    history.push("/apps/organizations/list");
                })
                .catch((e) => {
                    console.log(e)
                })
        } else {
        }

    }, [organizationName, customerID, customerLink, comment])

    useEffect(() => {
        if (!users && orgId) fetchUsers()
    }, [!users])

    useEffect(() => {
        if (!organization) fetchOrganization()
    }, [!organization])

    return (
        <div className="content-wrapper">
            {
                addUserActive ?
                    <AddUserAccount organization={organizationName} orgId={orgId} onBack={() => {setUsers(null); setAddUserActive(false)}} />
                    :
                    <div className="edit-organization">
                        <div className="edit-organization__header">
                            <Headline className="edit-organization__title">
                                Edit Organization
                            </Headline>
                            <div className="edit-organization__buttons">
                                <div className="edit-organization__cancel-btn" onClick={() => {
                                    dispatch(changeRoute('apps/organizations/list'))
                                    history.push("/apps/organizations/list")
                                }}>
                                    <Button type={'dotted'} text={'Cancel'} />
                                </div>
                                <div className="edit-organization__save-btn" onClick={() => updateOrganization()}>
                                    <Button type={'simple'} text={'Save'} />
                                </div>
                            </div>
                        </div>
                        <div className="edit-organization__body">
                            <div className="edit-organization__info">
                                <div className="edit-organization__info-title">
                                    Ogranization info
                                </div>
                                <div className="edit-organization__inputs">
                                    <div className="edit-organization__input">
                                        <Input onChangeInput={(value) => setOrganizationName(value)}
                                            value={organizationName}
                                            placeholder='Name of The Organization'
                                        />
                                    </div>
                                    <div className="edit-organization__input">
                                        <Input onChangeInput={(value) => setCustomerID(value)}
                                            value={customerID}
                                            placeholder='CRM Customer ID'
                                        />
                                    </div>
                                    <div className="edit-organization__input">
                                        <Input onChangeInput={(value) => setCustomerLink(value)}
                                            value={customerLink}
                                            placeholder='CRM Customer ID Link'
                                        />
                                    </div>
                                </div>
                                <div className="edit-organization__comments">
                                    <Input onChangeInput={(value) => setComment(value)}
                                        value={comment}
                                        placeholder='Comments'
                                        limit={200}
                                    />
                                </div>
                            </div>
                            <div className="edit-organization__user-list">
                                <div className="edit-organization__user-list-header">
                                    <div className="edit-organization__user-list-title">
                                        User List
                                    </div>
                                    <div className="edit-organization__user-list-add"
                                        onClick={() => setAddUserActive(true)}
                                    >
                                        <Button type={'simple'} text={'Add New'} icon={addIcon} />
                                    </div>
                                </div>
                                {!!users && <UserTable inEdit rows={users} deleteUser={deleteUser} />}
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}
