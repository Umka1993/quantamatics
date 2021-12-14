import React, { useState, useCallback, useEffect } from "react";
import "./styles/create-organization.scss";
import { useNavigate, useParams } from "react-router-dom";
import Button, { ResetButton } from "../button";
import Input, { DatePick, Email } from "../app-input/";
import Form from "./form";
import RoleCheckboxes from "../role-checkboxes";
import { AppRoute, UserRole } from "../../data/enum";
import { useRegisterUserMutation } from "../../api/account";
import { useGetOrganizationQuery } from "../../api/organization";

interface ICreateOrganization { }

const CreateOrganization: React.FunctionComponent<ICreateOrganization> = (

) => {
    const { id: organizationId } = useParams();

    const { data: company, isSuccess: isOrgLoaded } = useGetOrganizationQuery(organizationId as string);

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

    const backLink = `/apps/organizations/${company?.id}`;

    useEffect(() => {
        isSuccess && navigate(AppRoute.Success, {
            state: {
                headline: "An invitation email has been sent to the user",
                linkText: "Go Back",
                link: backLink
            }
        });
    }, [isSuccess])


    const navigate = useNavigate();

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
            headline="Create a User Account"
            subtitle="Add a new user account to your organization"
            onSubmit={addUserToOrg}
            stopLoading={isError}
        >
            <div className="create-organization__fields">
                <Input
                    externalSetter={setFirstName}
                    required
                    value={firstName}
                    label='First Name'
                />
                <Input
                    externalSetter={setLastName}
                    required
                    value={lastName}
                    label='Last Name'
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
                href={backLink}
            >
                Cancel
            </ResetButton>
        </Form>
    );
};

export default CreateOrganization;
