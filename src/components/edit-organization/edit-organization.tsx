import React, { FormEvent, useCallback, useEffect, useState, FunctionComponent } from "react";
import "./styles/edit-organizations.scss";
import AddIcon from "./assets/human-add.svg";
import Button, { ResetButton } from "../button";
import { UserTable } from "../table/UserTable";
import Input from "../app-input/";
import { useNavigate, useParams } from "react-router-dom";
import Headline from "../page-title/index";
import type { RouteParams } from "../../types/route-params";
import {
    useGetOrganizationQuery,
    useUpdateOrganizationMutation,
} from "../../api/organization";
import IApiError from "../../types/api-error";
import useUser from "../../hooks/useUser";
import { UserRole } from "../../data/enum";
import Loader from "../loader";

export const EditOrganization: FunctionComponent = () => {
    const user = useUser();
    const [organizationName, setOrganizationName] = useState<string>("");
    const [customerID, setCustomerID] = useState<string>("");
    const [customerLink, setCustomerLink] = useState<string>("");
    const [comment, setComment] = useState<string | undefined>("");

    const { id } = useParams<RouteParams>();
    const navigate = useNavigate();
    const [update, { isSuccess: isUpdated, isLoading: isUpdating, isError: isUpdateError, error: updateError }] =
        useUpdateOrganizationMutation();

    const { data, isSuccess, isError, error } = useGetOrganizationQuery(id as string);
    const isHaveAccessToOrgList =
        user?.userRoles.includes(UserRole.Admin) ||
        user?.userRoles.includes(UserRole.OrgOwner);

    useEffect(() => {
        if (isUpdated) {
            if (isHaveAccessToOrgList) {
                navigate("/apps/organizations/list");
            }
        }
    }, [isUpdated]);

    useEffect(() => {
        if (isUpdateError) {
            alert(JSON.stringify((updateError as any).data?.errors));
        }
    }, [isUpdateError])

    const setInitialOrg = useCallback(() => {
        if (data) {
            setOrganizationName(data.name);
            setCustomerID(data.customerCrmId);
            setCustomerLink(data.customerCrmLink);
            setComment(data.comments);
        }
    }, [data]);

    useEffect(() => {
        if (isSuccess && data) {
            setInitialOrg();
        }
    }, [isSuccess, data]);

    const submitHandler = (evt: any) => {
        evt.preventDefault();
        update({
            id,
            name: organizationName,
            customerCrmId: customerID,
            customerCrmLink: customerLink,
            comments: comment,
        });
    };

    const resetHandler = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setInitialOrg();

        if (isHaveAccessToOrgList) {
            navigate("/apps/organizations/list");
        }
    }

    return (
        <div className="edit-organization">
            <header className="edit-organization__header">
                <Headline className="edit-organization__title">
                    Edit Organization
                </Headline>
                <div className="edit-organization__buttons">
                    <ResetButton
                        onClick={
                            ({ target }) => (target as HTMLButtonElement).blur()
                        }
                        form="edit-organization"
                    >
                        Cancel
                    </ResetButton>

                    <Button
                        type="submit"
                        form="edit-organization"
                        className="edit-organization__save-btn"
                        disabled={isUpdating}
                    >
                        Save
                    </Button>
                </div>
            </header>
            {isError ? (
                <p>Error on loading data: {(error as IApiError).data} </p>
            ) : (
                <form
                    className="edit-organization__info"
                    id="edit-organization"
                    onSubmit={submitHandler}
                    onReset={resetHandler}
                >
                    {isUpdating ? (
                        <Loader />
                    ) : (
                        <>
                            <div className="edit-organization__inputs">
                                <div className="edit-organization__input">
                                    <Input
                                        externalSetter={setOrganizationName}
                                        value={organizationName}
                                        label='Org. Name'
                                        maxLength={64}
                                        required
                                    />
                                </div>
                                <div className="edit-organization__input">
                                    <Input
                                        externalSetter={setCustomerID}
                                        value={customerID}
                                        label='CRM Customer ID'
                                        maxLength={32}
                                    />
                                </div>
                                <div className="edit-organization__input">
                                    <Input
                                        externalSetter={setCustomerLink}
                                        value={customerLink}
                                        label='CRM Customer ID Link'
                                        maxLength={64}
                                    />
                                </div>
                            </div>
                            <div className="edit-organization__comments">
                                <Input
                                    externalSetter={setComment}
                                    value={comment}
                                    placeholder="Comments"
                                    label='Comments'
                                    maxLength={200}
                                    showLimit
                                />
                            </div>
                        </>
                    )}
                </form>
            )}
            <section className="edit-organization__user-list">
                <div className="edit-organization__user-list-header">
                    <h2 className="sub-headline">User Accounts</h2>

                    <Button
                        className="edit-organization__user-list-add"
                        href='add-user'
                    >
                        <AddIcon />
                        Add New
                    </Button>
                </div>

                <UserTable orgId={id as string} />
            </section>
        </div>
    );
};
