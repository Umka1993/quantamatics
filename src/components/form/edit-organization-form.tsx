import Button, { ResetButton } from "../button";
import React, {
    FormEvent,
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { Organization } from "types/organization/types";
import Headline from "../page-title";
import Input, { Multiselect } from "../app-input";

import style from "./styles/edit-organization.module.scss";
import { useNavigate } from "react-router-dom";
import { useGetAllOrganizationsQuery, useUpdateOrganizationMutation } from "../../api/organization";
import Loader from "../loader";
import { AppRoute } from "../../data/enum";
import * as assetsHooks from "../../api/asset";
import useDuplicatedOrgValues from "../../hooks/useDuplicatedOrgValues";

interface EditOrganizationFormProps {
    organization?: Organization;
    isHaveAccessToOrgList?: boolean;
    externalLoad?: boolean;
}




const EditOrganizationForm: FunctionComponent<EditOrganizationFormProps> = ({
    organization,
    isHaveAccessToOrgList,
    externalLoad,
}) => {
    const navigate = useNavigate();
    const [assetError, setAssetError] = useState(false)
    const [
        update,
        {
            isSuccess: isUpdated,
            isLoading: isUpdating,
            isError: isUpdateError,
            error: updateError,
        },
    ] = useUpdateOrganizationMutation();

    const { data: allOrganizations } =
        useGetAllOrganizationsQuery();

    const [name, setName] = useState<string>("");
    const [customerCrmId, setCustomerID] = useState<string>("");
    const [customerCrmLink, setCustomerLink] = useState<string>("");
    const [comments, setComment] = useState<string | undefined>("");
    const [datasets, setDatasets] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);

    const [duplicateOrgError, duplicateIdError, checkNameDuplicate, checkIdDuplicate] = useDuplicatedOrgValues(formRef, name, customerCrmId);

    const { data: assets } = assetsHooks.useGetAllAssetsQuery(
        organization?.id as string
    );
    const [deleteAsset, { isLoading: isDeletingAsset }] =
        assetsHooks.useDeleteAssetsMutation();
    const [createAsset, { isLoading: isCreatingAsset }] =
        assetsHooks.useCreateAssetsMutation();
    const [linkAsset, { isLoading: isLinkingAsset }] =
        assetsHooks.useLinkAssetToOrgMutation();

    const setInitialOrg = useCallback(() => {
        if (organization) {
            setName(organization.name);
            setCustomerID(organization.customerCrmId);
            setCustomerLink(organization.customerCrmLink);
            setComment(organization.comments);
        }

    }, [organization]);

    useEffect(() => {
        if (assets) {
            const onlyNamesArray = assets.map((asset) => asset.name);
            setDatasets(onlyNamesArray)
        }

    }, [assets]);

    useEffect(() => {
        organization && setInitialOrg();
    }, [organization]);



    function submitHandler(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        setLoading(true);

        if (!datasets.length) {
            setAssetError(true)
            return setLoading(false);
        }

        if (name !== organization?.name) {
            if (checkNameDuplicate()) {
                return setLoading(false);
            }
        }

        if (customerCrmId !== organization?.customerCrmId) {
            if (checkIdDuplicate()) {
                return setLoading(false);
            }
        }



        // if (assets) {
        //     assets.forEach((asset) => {
        //         /* Delete unselected assets */

        //         datasets.indexOf(asset.name) < 0 && deleteAsset(asset.assetId);

        //     });

        //     datasets.forEach((dataset) => {
        //         const foundedAsset = assets.find((asset) => asset.name === dataset);
        //         /* Create new and select to org assets */
        //         if (foundedAsset === undefined && organization) {
        //             createAsset({
        //                 name: dataset,
        //                 ownerOrganizationId: organization.id,
        //                 version: 1,
        //             })
        //                 .unwrap()
        //                 .then(({ id: assetId }) =>
        //                     linkAsset({ assetId, orgId: organization.id })
        //                 );
        //         }
        //     });

        // }



        update({
            ...organization,
            name,
            customerCrmId,
            customerCrmLink,
            comments,
            // organizationAssets: datasets
        });


        setLoading(false);


    }

    const resetHandler = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setInitialOrg();
        isHaveAccessToOrgList && navigate(AppRoute.OrganizationList);
    };

    useEffect(() => {
        if (isUpdateError) {
            alert((updateError as any).data?.errors);
        }
    }, [isUpdateError]);



    useEffect(() => {
        isUpdated && isHaveAccessToOrgList && navigate(AppRoute.OrganizationList);
    }, [isUpdated]);

    return (
        <form
            className={style.root}
            onSubmit={submitHandler}
            onReset={resetHandler}
            ref={formRef}
        >
            <header className={style.header}>
                <Headline className="edit-organization__title" style={{ margin: 0 }}>
                    Edit Organization
                </Headline>
                <div className={style.buttons}>
                    <ResetButton
                        onClick={({ target }) => (target as HTMLButtonElement).blur()}
                    >
                        Cancel
                    </ResetButton>

                    <Button
                        type="submit"
                        className={style.save}
                        disabled={isUpdating || externalLoad}
                    >
                        Save
                    </Button>
                </div>
            </header>

            {isUpdating ||
                externalLoad ||
                loading ||
                isDeletingAsset ||
                isCreatingAsset ||
                isLinkingAsset ? (
                <Loader />
            ) : (
                <div className={style.inputs}>
                    <Input
                        externalSetter={setName}
                        value={name}
                        label="Org. Name"
                        maxLength={64}
                        required
                        className={style.input}
                        error={duplicateOrgError}
                    />
                    <Input
                        externalSetter={setCustomerID}
                        value={customerCrmId}
                        label="CRM Customer ID"
                        maxLength={32}
                        className={style.input}
                        error={duplicateIdError}
                    />

                    <Input
                        externalSetter={setCustomerLink}
                        value={customerCrmLink}
                        label="CRM Customer ID Link"
                        maxLength={64}
                        className={style.input}
                    />

                    <Multiselect
                        options={[
                            "Coherence",
                            "Research",
                            "Backtest - Enterprise",
                            "Enterprise",
                            "Backtest - Express",
                            "Express",
                            "Backtest - CPG",
                            "CPG",
                            "Backtest - Summary v3.1",
                            "Summary v3.1",
                        ]}
                        label="Org. Datasets"
                        selected={datasets}
                        setSelected={setDatasets}
                        errorMessage='Select asset permissions to assign to the organization.'
                        showError={assetError}
                        className={style.input}
                    />

                    <Input
                        externalSetter={setComment}
                        value={comments}
                        placeholder="Comments"
                        label="Comments"
                        maxLength={200}
                        showLimit
                        className={style.input}
                    />
                </div>
            )}
        </form>
    );
};

export default EditOrganizationForm;
