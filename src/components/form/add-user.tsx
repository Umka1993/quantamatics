import React, { useState, useCallback, useEffect } from "react";
import "./styles/create-organization.scss";
import { useHistory, useParams } from "react-router-dom";
import Button, { ResetButton } from "../button";
import Input, { DatePick, Email } from "../app-input/";
import { useDispatch } from "react-redux";
import { changeRoute } from "../../store/currentPage/actions";
import Form from "./form";
import RoleCheckboxes from "../role-checkboxes";
import { UserRole } from "../../data/enum";
import { useRegisterUserMutation } from "../../api/account";
import { useGetOrganizationQuery } from "../../api/organization";

interface ICreateOrganization { }

const CreateOrganization: React.FunctionComponent<ICreateOrganization> = (

) => {
    const { id: organizationId } = useParams<{ id: string }>();

    const { data: company, isSuccess: isOrgLoaded } = useGetOrganizationQuery(organizationId);

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

    useEffect(() => {
        dispatch(changeRoute(`organizations/${company?.name}/add-user`));
    }, [isOrgLoaded])

    useEffect(() => {
        errors && setErrors(undefined);
    }, [email]);

    const addUserToOrg = useCallback(() => {
        register({
            firstName,
            lastName,
            email,
            organizationId: company?.id,
            companyName: company?.name,
            subscriptionEndDate,
            userRoles: userRoles
        })
    }, [firstName, lastName, email, subscriptionEndDate, userRoles, company]);

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
                    required
                    value={firstName}
                    label='Name'
                />
                <Input
                    externalSetter={setLastName}
                    required
                    value={lastName}
                    label='Surname'
                />
                <Email
                    externalSetter={setEmail}
                    required
                    value={email}
                    error={errors}
                    label='Email Address'
                />
                <DatePick
                    externalSetter={setSubscriptionEndDate}
                    valueAsDate={subscriptionEndDate}
                    minDate={new Date()}
                    required
                    label='Expiration Date'
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
                href={`/apps/organizations/${company?.id}`}
            >
                Cancel
            </ResetButton>
        </Form>
    );
};

export default CreateOrganization;
