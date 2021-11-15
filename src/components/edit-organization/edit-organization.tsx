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
    updateOrganization
} from "../../store/organization/actions";
import type { RouteParams } from "../../types/route-params";
import { useGetOrganizationQuery } from "../../api";

interface ApiError {
    status: number,
    data: string,
}


export const EditOrganization: React.FunctionComponent = (props) => {
    const [organizationName, setOrganizationName] = useState<string>("");
    const [customerID, setCustomerID] = useState<string>("");
    const [customerLink, setCustomerLink] = useState<string>("");
    const [comment, setComment] = useState<string | undefined>("");

    const { id } = useParams<RouteParams>();


    const { data, isSuccess, isError, error } = useGetOrganizationQuery(id);
    console.log(error);
    
    useEffect(() => {
        if (isSuccess && data) {
            setOrganizationName(data.name);
            setCustomerID(data.customerCrmId)
            setCustomerLink(data.customerCrmLink)
            setComment(data.comments)
        }
    }, [isSuccess])

    const dispatch = useDispatch();
    const history = useHistory();

    const deleteUser = (id: number) => {
        // TODO: Delete user

        console.log(`Guy #${id} bust be deleted`);
    };

    const saveCompanyInfo = (data: any) => {
        dispatch(changeRoute(`apps/organizations/${data.name}`));
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
                    {isError ? <p>Error on loading data: {(error as ApiError).data} </p> :
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
                            <h2 className="sub-headline">
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
                        </form>}
                    <div className="edit-organization__user-list">
                        <div className="edit-organization__user-list-header">
                            <h2 className="sub-headline">
                                User List
                            </h2>

                            <Button
                                className="edit-organization__user-list-add"
                                href={`/apps/organizations/${id}/add-user`}
                            >
                                <AddIcon />
                                Add New
                            </Button>
                        </div>

                        <UserTable inEdit deleteUser={deleteUser} />

                    </div>
                </div>
            </div>
        </div>
    );
};
