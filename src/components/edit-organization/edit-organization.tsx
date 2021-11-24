import React, { FormEvent, useCallback, useEffect, useState } from "react";
import "./styles/edit-organizations.scss";
import AddIcon from "./assets/human-add.svg";
import Button, { ResetButton } from "../button";
import { UserTable } from "../table/UserTable";
import { Input } from "../input";
import { useHistory, useParams } from "react-router-dom";
import { changeRoute } from "../../store/currentPage/actions";
import { useDispatch } from "react-redux";
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

export const EditOrganization: React.FunctionComponent = (props) => {
    const user = useUser();
    const [organizationName, setOrganizationName] = useState<string>("");
    const [customerID, setCustomerID] = useState<string>("");
    const [customerLink, setCustomerLink] = useState<string>("");
    const [comment, setComment] = useState<string | undefined>("");

    const { id } = useParams<RouteParams>();

    const [update, { isSuccess: isUpdated, isLoading: isUpdating }] =
        useUpdateOrganizationMutation();

    const { data, isSuccess, isError, error } = useGetOrganizationQuery(id);
    const isHaveAccessToOrgList =
        user?.userRoles.includes(UserRole.Admin) ||
        user?.userRoles.includes(UserRole.OrgOwner);

    useEffect(() => {
        if (isUpdated) {
            if (isHaveAccessToOrgList) {
                dispatch(changeRoute("apps/organizations/list"));
                history.push("/apps/organizations/list");
            }
        }
    }, [isUpdated]);

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
            dispatch(changeRoute(`apps/organizations/${data.name}`));
        }
    }, [isSuccess]);

    const dispatch = useDispatch();
    const history = useHistory();

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
            dispatch(changeRoute("apps/organizations/list"));
            history.push("/apps/organizations/list");
        }
    }

    return (
        <div className="content-wrapper">
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
                <div className="edit-organization__body">
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
                                </>
                            )}
                        </form>
                    )}
                    <div className="edit-organization__user-list">
                        <div className="edit-organization__user-list-header">
                            <h2 className="sub-headline">User Accounts</h2>

                            <Button
                                className="edit-organization__user-list-add"
                                href={`/apps/organizations/${id}/add-user`}
                            >
                                <AddIcon />
                                Add New
                            </Button>
                        </div>

                        <UserTable />
                    </div>
                </div>
            </div>
        </div>
    );
};
