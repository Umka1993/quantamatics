import Button from "../button";
import React, {
    FormEvent,
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { Organization } from "types/organization/types";

import Input, { InputURL } from "../app-input";

import style from "./styles/edit-organization.module.scss";
import {
    useLazyGetOrganizationQuery,
    useUpdateOrganizationMutation,
} from "../../api/organization";
import useDuplicatedOrgValues from "../../hooks/useDuplicatedOrgValues";
import { AssetInOrganization } from "../../types/asset";
import useUser from "../../hooks/useUser";
import normalizeName from "../../services/normalize-name";

import addHTTPtoURL from "../../services/addHTTPtoURL";
import AssetsModalWindow from "../app-input/assets-modal-window";

import SaveResetHeader from "../save-reset-header/SaveResetHeader";
import DocIcon from './assets/doc.svg'
import AssetModal from "../asset-modal/AssetModal";

interface EditOrganizationFormProps {
    organization?: Organization;
    isHaveAccessToOrgList?: boolean;
    externalLoad?: boolean;
}

const EditOrganizationForm: FunctionComponent<EditOrganizationFormProps> = ({
    organization,
    externalLoad,
}) => {
    const user = useUser();
    const [assetError, setAssetError] = useState(false);
    const [
        update,
        {
            isSuccess: isUpdated,
            isLoading: isUpdating,
            isError: isUpdateError,
            error: updateError,
        },
    ] = useUpdateOrganizationMutation();

    const isUserOrganization = user?.organizationId === organization?.id;

    const [name, setName] = useState<string>("");
    const [customerCrmId, setCustomerID] = useState<string>("");
    const [customerCrmLink, setCustomerLink] = useState<string>("");
    const [comments, setComment] = useState<string | undefined>("");
    const [loading, setLoading] = useState(false);

    const [assignedAssets, setAssignedAssets] = useState<AssetInOrganization[]>(
        organization?.organizationAssets || []
    );
    const [options, setOptions] = useState<AssetInOrganization[]>([]);

    const [isSavedMessageActive, setSavedMessageActive] = useState(false);

    const [isChanged, setIsChanged] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);

    const [getInfoOrg] = useLazyGetOrganizationQuery();

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
        setCustomerID
    );

    function initOptions() {
        if (organization && user) {
            const prepareOptions = (allAssets: AssetInOrganization[]) => {
                setOptions(
                    [...allAssets].map((asset) => {
                        const alreadySelectedAsset = organization.organizationAssets.find(
                            ({ assetId }) => assetId === asset.assetId
                        );

                        return alreadySelectedAsset === undefined
                            ? { ...asset, organizationId: organization.id }
                            : alreadySelectedAsset;
                    })
                );
            };

            if (isUserOrganization) {
                setOptions(organization.organizationAssets);
            } else {
                getInfoOrg(user.organizationId as string)
                    .unwrap()
                    .then(({ organizationAssets: allAssets }) =>
                        prepareOptions(allAssets)
                    );
            }
        }
    }

    useEffect(initOptions, [organization, user]);

    const setInitialOrg = useCallback(() => {
        if (organization) {
            setName(organization.name);
            setCustomerID(organization.customerCrmId);
            setCustomerLink(organization.customerCrmLink);
            setComment(organization.comments);
            setAssignedAssets(organization.organizationAssets);
        }
    }, [organization]);

    useEffect(() => {
        organization && setInitialOrg();
    }, [organization]);

    function submitHandler(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        setLoading(true);

        if (!assignedAssets.length) {
            setAssetError(true);
            return setLoading(false);
        }

        let duplicate = false;

        const normalizedName = normalizeName(name);

        if (normalizedName !== organization?.name) {
            duplicate = checkNameDuplicate();
        }

        if (customerCrmId !== organization?.customerCrmId) {
            duplicate = checkIdDuplicate() || duplicate;
        }

        if (duplicate) {
            return setLoading(false);
        }

        if (organization) {
            update({
                ...organization,
                name: normalizedName,
                customerCrmId,
                customerCrmLink: addHTTPtoURL(customerCrmLink),
                comments,
                organizationAssets: [...assignedAssets].map((asset) => ({
                    ...asset,
                    asset: null,
                })),
            });
        }
        setLoading(false);
    }

    const resetHandler = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setInitialOrg();
    };

    useEffect(() => {
        if (isUpdateError) {
            alert((updateError as any).data?.errors);
        }
    }, [isUpdateError]);

    useEffect(() => {
        if (isUpdated) {
            setOptions([]);
            initOptions();
            setSavedMessageActive(true);
        }
    }, [isUpdated]);

    useEffect(() => {
        if (isSavedMessageActive) {
            setTimeout(() => setSavedMessageActive(false), 2000);
            setIsChanged(false);
            setCustomerLink(addHTTPtoURL(customerCrmLink));
        }
    }, [isSavedMessageActive]);

    useEffect(setInitialOrg, [organization]);

    useEffect(() => {
        if (organization) {
            const isQuickChanged =
                organization.name !== name ||
                organization.customerCrmId !== customerCrmId ||
                organization.organizationAssets.length !== assignedAssets.length ||
                organization.customerCrmLink !== customerCrmLink ||
                organization.comments !== comments;

            if (isQuickChanged) {
                setIsChanged(true);
            } else {
                let isSharedChanged = false;
                assignedAssets.forEach((asset) => {
                    const foundedInitialAsset = organization.organizationAssets.find(
                        (initialAsset) => initialAsset.assetId === asset.assetId
                    );

                    if (
                        foundedInitialAsset === undefined ||
                        foundedInitialAsset.sharedByDefault !== asset.sharedByDefault
                    ) {
                        isSharedChanged = true;
                    }
                });
                setIsChanged(isSharedChanged);
            }
        }
    }, [
        name,
        customerCrmId,
        customerCrmLink,
        comments,
        assignedAssets,
        organization,
    ]);


    const [showOptions, setShowOptions] = useState(false);

    const hideModal = () => {
        setTimeout(() => setShowOptions(false), 300)
    }

    const assetsReset = () => {
        if (organization) {
            setAssignedAssets(organization.organizationAssets);
        }
        hideModal()
    };

    const assignedAssetsReset = (target: HTMLButtonElement) => {
        target.blur();
        if (organization) {
            setAssignedAssets(organization.organizationAssets);
        }
    };



    const toggleOptions = () => {
        setShowOptions(prevState => !prevState);
    };

    return (
        <>
            <form
                className={style.root}
                onSubmit={submitHandler}
                onReset={resetHandler}
                ref={formRef}
            >
                <SaveResetHeader
                    headline="Edit Organization"
                    disableReset={isUpdating}
                    disableSave={
                        !isChanged ||
                        isUpdating ||
                        externalLoad ||
                        Boolean(duplicateOrgError) ||
                        Boolean(duplicateIdError)
                    }
                    isSavedMessageActive={isSavedMessageActive}
                />
                <div className={style.inputs}>
                    <Input
                        externalSetter={setName}
                        value={name}
                        label="Org. Name"
                        maxLength={64}
                        required
                        className={style.input}
                        error={duplicateOrgError}
                        disabled={isUpdating}
                        variant="squared"
                    />
                    <Input
                        externalSetter={setCustomerID}
                        value={customerCrmId}
                        label="CRM Customer ID"
                        maxLength={32}
                        className={style.input}
                        error={duplicateIdError}
                        disabled={isUpdating}
                        variant="squared"
                    />

                    <InputURL
                        externalSetter={setCustomerLink}
                        value={customerCrmLink}
                        label="CRM Customer ID Link"
                        maxLength={72}
                        className={style.input}
                        disabled={isUpdating}
                        variant="squared"
                    />

                    <Input
                        externalSetter={setComment}
                        value={comments}
                        placeholder="Comments"
                        label="Comments"
                        maxLength={200}
                        showLimit
                        className={style.input}
                        disabled={isUpdating}
                        variant="squared"
                    />
                </div>

                <p className={style.assets}>
                    <Button
                        type='button'
                        className={style.save}
                        disabled={false}
                        onClick={toggleOptions}
                    >
                        <DocIcon width={21} height={21} fill='currentColor' aria-hidden />
                        Manage Assets
                    </Button>
                    Manage assets for the organization
                </p>
            </form>

            <AssetModal 
                open={showOptions} 
                closeFunction={toggleOptions} 
                options={options} 
                selected={assignedAssets}
            />
            
            {/* {showOptions && <AssetsModalWindow
                showOptions={showOptions}
                setShowOptions={setShowOptions}
                options={options}
                selected={assignedAssets}
                errorMessage="Select asset permissions to assign to the organization."
                showError={assetError}
                setSelected={setAssignedAssets}
                disabled={isUserOrganization}
                type="edit-organization"
                isUpdating={isUpdating}
                isChanged={isChanged}
                duplicateOrgError={duplicateOrgError}
                duplicateIdError={duplicateIdError}
                organization={organization}
                setAssignedAssets={setAssignedAssets}
                hideModal={hideModal}
        
                assetsReset={assetsReset}
            />} */}
        </>
    );
};

export default EditOrganizationForm;
