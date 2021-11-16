import React, { useState, useCallback, useEffect } from "react";
import "./styles/create-organization.scss";
import { useHistory, useParams } from "react-router-dom";
import Button, { ResetButton } from "../button";
import Input, { DatePick, Email } from "../app-input/";
import { useDispatch } from "react-redux";
import { changeRoute } from "../../store/currentPage/actions";
import Form from "./form";
import { fetchOrganization } from "../../store/organization/actions";
import RoleCheckboxes from "../role-checkboxes";
import { UserRole } from "../../data/enum";
import { useRegisterUserMutation } from "../../api/account";

interface ICreateOrganization { }

const CreateOrganization: React.FunctionComponent<ICreateOrganization> = (
    
) => {
    const { id: organizationId } = useParams<{ id: string }>();

    const [companyName, setCompanyName] = useState<string>("");

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date>(
        new Date()
    );

    const [errors, setErrors] = useState<string | undefined>(undefined);

    const [userRoles, setRoles] = useState<UserRole[]>([]);

    const [register, { isSuccess, isError, error }] = useRegisterUserMutation();
    

    useEffect(() => {
        isError && (error as any).data[0].code === "DuplicateUserName" 
            && setErrors("The user with such email already exists")
    }, [isError])


    useEffect(() => {
        isSuccess && history.push("/success-invitation");
    }, [isSuccess])
    

    const history = useHistory();
    const dispatch = useDispatch();

    const getOrgName = (data: any) => {
        dispatch(changeRoute(`organizations/${data.name}/add-user`));
        setCompanyName(data.name);
    };

    useEffect(() => {
        dispatch(fetchOrganization(organizationId, getOrgName));
    }, [organizationId]);

    useEffect(() => {
        errors && setErrors(undefined);
    }, [email]);

    const addUserToOrg = useCallback(() => {
        register({
            firstName,
            lastName,
            email,
            organizationId,
            companyName,
            subscriptionEndDate,
            userRoles: userRoles
        })
    }, [firstName, lastName, email, subscriptionEndDate, userRoles]);

    return (
        <Form
            className="create-organization"
            headline="Add User Accounts"
            subtitle="Add users to your organization and manage them"
            onSubmit={addUserToOrg}
            stopLoading={isError}
        >
            <div className="create-organization__fields">
                <Input
                    externalSetter={setFirstName}
                    placeholder="Name"
                    required
                    value={firstName}
                />
                <Input
                    externalSetter={setLastName}
                    placeholder="Last name"
                    required
                    value={lastName}
                />
                <Email
                    externalSetter={setEmail}
                    placeholder="Email Address"
                    required
                    value={email}
                    error={errors}
                />
                <DatePick
                    externalSetter={setSubscriptionEndDate}
                    valueAsDate={subscriptionEndDate}
                    minDate={new Date()}
                    required
                />
                <RoleCheckboxes defaultRoles={userRoles} externalSetter={setRoles} />
            </div>
            <Button
                className="create-organization__submit"
                type="submit"
                disabled={
                    !Boolean(firstName && lastName && email && subscriptionEndDate)
                }
            >
                Save
            </Button>

            <ResetButton
                className="create-organization__cancel"
                href={`/apps/organizations/${organizationId}`}
            >
                Cancel
            </ResetButton>
        </Form>
    );
};

export default CreateOrganization;
