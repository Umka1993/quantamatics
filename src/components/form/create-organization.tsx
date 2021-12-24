import React, { useEffect, useState, FunctionComponent } from "react";
import "./styles/create-organization.scss";
import Input from "../app-input";
import { useNavigate } from "react-router-dom";
import Button, { ResetButton } from "../button";
import Form from "./form";
import { useAddOrganizationMutation } from "../../api/organization";
import { AppRoute } from "../../data/enum";
import { useCreateAssetsMutation } from "../../api/asset";

interface ICreateOrganization { }

export interface createOrganizationRequestBody {
    name: string;
    comments?: string;
    customerCrmId?: string;
    customerCrmLink?: string;
}

const CreateOrganization: FunctionComponent<ICreateOrganization> = () => {
    const navigate = useNavigate();

    const [register, { isError, isSuccess, error, data }] = useAddOrganizationMutation();

    const [name, setName] = useState<string>("");
    const [customerCrmId, setCustomerCrmId] = useState<string>("");
    const [customerCrmLink, setCustomerCrmLink] = useState<string>("");
    const [comments, setComments] = useState<string | undefined>("");
    const [datasets, setDatasets] = useState<string[]>([]);

    const [createAsset, { isLoading }] = useCreateAssetsMutation();

    const returnBack = () => {
        navigate(AppRoute.OrganizationList);
    };

    useEffect(() => {
        if (isSuccess && data) {
            datasets.forEach(asset => createAsset({
                name: asset,
                ownerOrganizationId: data.id,
                version: 1
            }))
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            console.log((error as any).data?.errors);
        }
    }, [isError])

    const registerOrganization = () => {
        register({ name, customerCrmId, customerCrmLink, comments }).unwrap();
    }

    return (
        <Form
            className="create-organization"
            headline="Create an Organization"
            subtitle="Add a new organization to Quantamatics"
            onSubmit={registerOrganization}
            onReset={returnBack}
            stopLoading={isError}
        >
            <div className="create-organization__fields">
                <Input
                    externalSetter={setName}
                    label="Organization Name"
                    required
                    value={name}
                    maxLength={64}
                />

                <Input
                    externalSetter={setCustomerCrmId}
                    label="CRM Customer ID"
                    value={customerCrmId}
                    maxLength={32}
                />

                {/* <InputURL 
                    externalSetter={setCustomerCrmLink} value={customerCrmLink}
                    placeholder='CRM Customer ID Link' maxLength={32}
                /> */}

                <Input
                    externalSetter={setCustomerCrmLink}
                    label="CRM Customer ID Link"
                    value={customerCrmLink}
                    type="url"
                    maxLength={64}
                />

                <Input
                    externalSetter={setComments}
                    label="Comments"
                    value={comments}
                    maxLength={200}
                    showLimit
                />
                {/* <Multiselect
                    options={['Coherence', 'Research', 'Backtest - Enterprise', 'Enterprise', 'Backtest - Express', 'Express', 'Backtest - CPG', 'CPG', 'Backtest - Summary v3.1', 'Summary v3.1']}
                    label='Org. Datasets'
                    selected={datasets}
                    setSelected={setDatasets}
                /> */}
            </div>

            <Button
                className="create-organization__submit"
                type="submit"
                disabled={!name}
            >
                Save
            </Button>
            <ResetButton className="create-organization__cancel">Cancel</ResetButton>
        </Form>
    );
};

export default CreateOrganization;
