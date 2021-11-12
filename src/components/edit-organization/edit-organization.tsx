import React, { useEffect, useState } from "react";
import "./styles/edit-organizations.scss";
import AddIcon from "./assets/human-add.svg";
import Button, { ResetButton } from "../button";
import { UserTable } from "../table/UserTable";
import { Input } from "../input";
import { useHistory, useParams } from "react-router-dom";
import { changeRoute } from "../../store/currentPage/actions";
import { useDispatch } from "react-redux";
import Headline from "../page-title/index";
// import { changeAllNavLinks } from "../../store/breadcrumbs/actions";
import {
    fetchOrganization,
    updateOrganization,
} from "../../store/organization/actions";
// import { fetchOrganizationUsers } from "../../store/user/actions";
import type { RouteParams } from "../../types/route-params";
import { setList } from "../../store/user";
import { useGetOrganizationUsersQuery } from "../../api";
import Loader from "../loader";



export const EditOrganization: React.FunctionComponent = (props) => {
    const [organizationName, setOrganizationName] = useState<string>("");
    const [customerID, setCustomerID] = useState<string>("");
    const [customerLink, setCustomerLink] = useState<string>("");
    const [comment, setComment] = useState<string | undefined>("");
    const [organization, setOrganization] = useState<any>(null);

    const { id } = useParams<RouteParams>();

    const { data, isError, isSuccess, isLoading } = useGetOrganizationUsersQuery(id)


    // const {data, isSuccess} = useGetOrganizationQuery(orgId)

    const dispatch = useDispatch();
    const history = useHistory();

    const deleteUser = (id: number) => {
        // TODO: Delete user

        console.log(`Guy #${id} bust be deleted`);
    };

    const saveCompanyInfo = (data: any) => {
        dispatch(changeRoute(`apps/organizations/${data.name}`));
        setOrganization(data);
        setOrganizationName(data.name);
        setCustomerID(data.customerCrmId);
        setCustomerLink(data.customerCrmLink);
        setComment(data.comments);
    };

    const submitHandler = (evt: any) => {
        evt.preventDefault();

        dispatch(
            updateOrganization(
                {
                    id,
                    name: organizationName,
                    customerCrmId: customerID,
                    customerCrmLink: customerLink,
                    comments: comment,
                },
                (r: any) => {
                    console.log(r);
                    dispatch(changeRoute("apps/organizations/list"));
                    history.push("/apps/organizations/list");
                },
                (e: any) => {
                    console.log(e);
                }
            )
        );
    };

    // useEffect(() => {
    //     id && dispatch(
    //         fetchOrganizationUsers(id)
    //     );

    //     return () => {id && dispatch(setList([]))};

    // }, [id]);

    // useEffect(() => {
    //     if (!organization) dispatch(fetchOrganization(id, saveCompanyInfo));
    // }, [!organization]);

    return (
        <div className="content-wrapper">
            <div className="edit-organization">
                <header className="edit-organization__header">
                    <Headline className="edit-organization__title">
                        Edit Organization
                    </Headline>
                    <div className="edit-organization__buttons">
                        <ResetButton
                            // href='/apps/organizations/list'
                            form="edit-organization"
                            className="edit-organization__cancel-btn"
                            onClick={() => { }}
                        >
                            Cancel
                        </ResetButton>

                        <Button
                            type="submit"
                            form="edit-organization"
                            className="edit-organization__save-btn"
                        >
                            Save
                        </Button>
                    </div>
                </header>
                <div className="edit-organization__body">
                    <form
                        className="edit-organization__info"
                        id="edit-organization"
                        onSubmit={submitHandler}
                        onReset={(evt) => {
                            evt.preventDefault();
                            dispatch(changeRoute("apps/organizations/list"));
                            history.push("/apps/organizations/list");
                        }}
                    >
                        <h2 className="subheadline edit-organization__info-title">
                            Ogranization info
                        </h2>
                        <div className="edit-organization__inputs">
                            <div className="edit-organization__input">
                                <Input
                                    onChangeInput={(value) => setOrganizationName(value)}
                                    value={organizationName}
                                    placeholder="Name of The Organization"
                                />
                            </div>
                            <div className="edit-organization__input">
                                <Input
                                    onChangeInput={(value) => setCustomerID(value)}
                                    value={customerID}
                                    placeholder="CRM Customer ID"
                                />
                            </div>
                            <div className="edit-organization__input">
                                <Input
                                    onChangeInput={(value) => setCustomerLink(value)}
                                    value={customerLink}
                                    placeholder="CRM Customer ID Link"
                                />
                            </div>
                        </div>
                        <div className="edit-organization__comments">
                            <Input
                                onChangeInput={(value) => setComment(value)}
                                value={comment}
                                placeholder="Comments"
                                limit={200}
                            />
                        </div>
                    </form>
                    <div className="edit-organization__user-list">
                        <div className="edit-organization__user-list-header">
                            <h2 className="subheadline edit-organization__user-list-title">
                                User List
                            </h2>

                            <Button
                                className="edit-organization__user-list-add"
                                href={`/apps/organizations/${id}/add-user`}
                            // onClick={() => setAddUserActive(true)}
                            >
                                <AddIcon />
                                Add New
                            </Button>
                        </div>


                        {isLoading && <div className="edit-organization__load">
                            <Loader />
                        </div>}

                        {isSuccess && <UserTable inEdit deleteUser={deleteUser} />}

                    </div>
                </div>
            </div>
        </div>
    );
};
