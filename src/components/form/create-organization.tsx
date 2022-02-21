import React, { useEffect, useState, FunctionComponent, useRef } from "react";
import "./styles/create-organization.scss";
import Input, { Multiselect, InputURL } from "../app-input";
import { useNavigate } from "react-router-dom";
import Button, { ResetButton } from "../button";
import Form from "./form";
import { useAddOrganizationMutation } from "../../api/organization";
import { AppRoute } from "../../data/enum";
import useUser from "../../hooks/useUser";
import {
    useGetAllAssetsQuery,
    useLinkAssetToOrgMutation,
} from "../../api/asset";
import useDuplicatedOrgValues from "../../hooks/useDuplicatedOrgValues";
import normalizeName from "../../services/normalize-name";
import addHTTPtoURL from "../../services/addHTTPtoURL";

interface ICreateOrganization { }

export interface createOrganizationRequestBody {
    name: string;
    comments?: string;
    customerCrmId?: string;
    customerCrmLink?: string;
}

const CreateOrganization: FunctionComponent<ICreateOrganization> = () => {
    const user = useUser();
    const navigate = useNavigate();
    const [register, { isError, isSuccess, error, data }] =
        useAddOrganizationMutation();

    const [name, setName] = useState<string>("");
    const [customerCrmId, setCustomerCrmId] = useState<string>("");
    const [customerCrmLink, setCustomerCrmLink] = useState<string>("");
    const [comments, setComments] = useState<string | undefined>("");
    const [assignedAssets, setAssignedAssets] = useState<Set<string | number>>(
        new Set()
    );

    const [assetError, setAssetError] = useState(false);

    const [stopLoading, setStopLoading] = useState<true | undefined>(undefined);

    const formRef = useRef<HTMLFormElement>(null);

    const [
        duplicateOrgError,
        duplicateIdError,
        checkNameDuplicate,
        checkIdDuplicate,
    ] = useDuplicatedOrgValues(
        formRef,
        name,
        customerCrmId,
        setName,
        setCustomerCrmId
    );
    // Load all assets that are available for logged user
    const { data: allAvailableAsset, isSuccess: isAllAssetLoaded } =
        useGetAllAssetsQuery(user?.organizationId as string);

    const [linkAsset, { isLoading: isLinkingAsset }] =
        useLinkAssetToOrgMutation();

    const returnBack = () => {
        navigate(AppRoute.OrganizationList);
    };

    useEffect(() => {
        if (isSuccess && data) {
            assignedAssets.forEach((assetId) =>
                linkAsset({
                    assetId,
                    orgId: data.id,
                })
            );
            returnBack();
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            const text = (error as any).data.errors;
            console.log(text);
        }
    }, [isError]);

    useEffect(() => {
        stopLoading && setStopLoading(undefined);
    }, [stopLoading]);

    const handleSubmit = () => {
        if (!assignedAssets.size) {
            setAssetError(true);
            return setStopLoading(true);
        }

        let duplicate = checkNameDuplicate();
        duplicate = (customerCrmId && checkIdDuplicate()) || duplicate;

        if (duplicate) {
            return setStopLoading(true);
        } else {
            register({
                name: normalizeName(name),
                customerCrmId,
                customerCrmLink: addHTTPtoURL(customerCrmLink),
                comments,
            }).unwrap();
        }
    };

    return (
        <Form
            className="create-organization"
            headline="Create an Organization"
            subtitle="Add a new organization to Quantamatics"
            onSubmit={handleSubmit}
            onReset={returnBack}
            stopLoading={isError || stopLoading}
            forwardRef={formRef}
        >
            <div className="create-organization__fields">
                <Input
                    externalSetter={setName}
                    label="Organization Name"
                    required
                    value={name}
                    maxLength={64}
                    error={duplicateOrgError}
                />

                <Input
                    externalSetter={setCustomerCrmId}
                    label="CRM Customer ID"
                    value={customerCrmId}
                    maxLength={32}
                    error={duplicateIdError}
                />
                <InputURL
                    externalSetter={setCustomerCrmLink}
                    label="CRM Customer ID Link"
                    value={customerCrmLink}
                    maxLength={72}
                />

                <Input
                    externalSetter={setComments}
                    label="Comments"
                    value={comments}
                    maxLength={200}
                    showLimit
                />

                {allAvailableAsset && (
                    <Multiselect
                        options={allAvailableAsset}
                        label="Org. Assets"
                        selected={assignedAssets}
                        setSelected={setAssignedAssets}
                        errorMessage="Select asset permissions to assign to the organization."
                        showError={assetError}
                    />
                )}
            </div>

            <Button
                className="create-organization__submit"
                type="submit"
                disabled={
                    !name ||
                    duplicateOrgError !== undefined ||
                    duplicateIdError !== undefined
                }
            >
                Save
            </Button>
            <ResetButton className="create-organization__cancel">Cancel</ResetButton>
        </Form>
    );
};

export default CreateOrganization;
