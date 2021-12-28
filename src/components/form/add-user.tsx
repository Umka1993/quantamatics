import React, { useState, useCallback, useEffect, FunctionComponent, useRef } from "react";
import "./styles/create-organization.scss";
import { useNavigate, useParams } from "react-router-dom";
import Button, { ResetButton } from "../button";
import Input, { DatePick, Email, Multiselect } from "../app-input/";
import Form from "./form";
import RoleCheckboxes from "../role-checkboxes";
import { AppRoute, UserRole } from "../../data/enum";
import { useRegisterUserMutation } from "../../api/account";
import { useGetOrganizationQuery } from "../../api/organization";
import { useGetAllAssetsQuery, useLinkAssetToUserMutation } from "../../api/asset";


const InviteUserForm: FunctionComponent = () => {
    const { id: organizationId } = useParams();

    const { data: company, isSuccess: isOrgLoaded } = useGetOrganizationQuery(organizationId as string);

    const { data: assets } = useGetAllAssetsQuery(
        organizationId as string
    );
    const [datasets, setDatasets] = useState<string[]>([]);
    const [assetError, setAssetError] = useState(false)
    const [loading, setLoading] = useState(false)

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date>(
        new Date()
    );

    const [errors, setErrors] = useState<string | undefined>(undefined);

    const [userRoles, setRoles] = useState<UserRole[]>([]);

    const [register, { isSuccess: isUserRegistered, isError, error, data: registeredUser }] = useRegisterUserMutation();
    const formRef = useRef<HTMLFormElement>(null);

    const [linkAsset] = useLinkAssetToUserMutation();

    
    useEffect(() => {
        if (isError) {
            if ((error as any).data[0]?.code === "DuplicateUserName")
                setErrors("The user with such email already exists");
            else alert(JSON.stringify((error as any).data?.errors));
        }
    }, [isError])

    const backLink = `/apps/organizations/${company?.id}`;

    useEffect(() => {
        if (isUserRegistered && registeredUser && assets) {
            datasets.forEach((selectedAsset) => {
                const foundedAsset = assets.find(element => element.name === selectedAsset)

                foundedAsset && linkAsset({
                    assetId: foundedAsset.assetId, userId: (registeredUser as any).id,
                })
            })


            navigate(AppRoute.Success, {
                state: {
                    headline: "An invitation email has been sent to the user",
                    linkText: "Go Back",
                    link: backLink
                }
            });
        }

    }, [isUserRegistered])


    const navigate = useNavigate();

    useEffect(() => {

        errors && setErrors(undefined);
    }, [email]);

    useEffect(() => {
        errors && formRef.current && formRef.current.reportValidity();
    }, [errors, formRef.current]);

    const addUserToOrg = () => {

        if (datasets.length) {
            setLoading(true)
            register({
                firstName,
                lastName,
                email,
                organizationId: company?.id,
                companyName: company?.name,
                subscriptionEndDate,
                userRoles: userRoles
            })
        } else {
            setAssetError(true)
        }
    }

    return (
        <Form
            className="create-organization"
            headline="Create a User Account"
            subtitle="Add a new user account to your organization"
            onSubmit={addUserToOrg}
            stopLoading={isError || assetError || loading}
            forwardRef={formRef}
        >
            <div className="create-organization__fields">
                <Input
                    externalSetter={setFirstName}
                    required
                    value={firstName}
                    maxLength={100}
                    label='First Name'
                />
                <Input
                    externalSetter={setLastName}
                    required
                    value={lastName}
                    maxLength={100}
                    label='Last Name'
                />
                <Email
                    externalSetter={setEmail}
                    required
                    value={email}
                    maxLength={100}
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
                <Multiselect
                    options={assets?.map((asset) => asset.name) || []}
                    selected={datasets}
                    setSelected={setDatasets}
                    label="Account Datasets"
                    errorMessage='Select asset permissions to assign to the user account.'
                    showError={assetError}
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

export default InviteUserForm;
