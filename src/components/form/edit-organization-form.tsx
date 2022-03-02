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
import Input, { InputURL, Multiselect } from "../app-input";

import style from "./styles/edit-organization.module.scss";
import {
    useLazyGetOrganizationQuery,
    useUpdateOrganizationMutation,
} from "../../api/organization";
import useDuplicatedOrgValues from "../../hooks/useDuplicatedOrgValues";
import { AssetInOrganization } from "../../types/asset";
import useUser from "../../hooks/useUser";
import normalizeName from "../../services/normalize-name";
import CheckSVG from "./assets/check.svg";
import addHTTPtoURL from "../../services/addHTTPtoURL";

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

    const [isSavedMessageActive, setSavedMessageActive] = useState(false);

    const [isChanged, setIsChanged] = useState(true);

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

    const [options, setOptions] = useState<AssetInOrganization[]>([]);

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
            setTimeout(() => setIsChanged(true), 2000);
        }
    }, [isSavedMessageActive]);

    useEffect(() => {
        if (organization) {
            setName(organization.name);
            setCustomerID(organization.customerCrmId);
            setAssignedAssets(organization.organizationAssets);
            setCustomerLink(organization.customerCrmLink);
            setComment(organization.comments);
        }
    }, [organization, isSavedMessageActive]);

    useEffect(() => {
        if (organization) {
            if (
                organization.name !== name ||
                organization.customerCrmId !== customerCrmId ||
                organization.organizationAssets.length !== assignedAssets.length ||
                organization.customerCrmLink !== customerCrmLink ||
                organization.comments !== comments
            ) {
                setIsChanged(false);
            } else {
                setIsChanged(true);
            }
        }
    }, [name, customerCrmId, customerCrmLink, comments, assignedAssets]);

    const assignedAssetsReset = (target: HTMLButtonElement) => {
        target.blur();
        if (organization) {
            setAssignedAssets(organization.organizationAssets);
        }
    };
    useEffect(() => {
        assignedAssets.length &&
            console.log(`Is setted: ${assignedAssets[0].sharedByDefault}`);
    }, [assignedAssets]);

    return (
        <form
            className={style.root}
            onSubmit={submitHandler}
            onReset={resetHandler}
            ref={formRef}
        >
            <header className={style.header}>
                <Headline className="edit-organization__title" style={{ margin: 0 }}>
                    Edit Organization {organization?.parentOrganization}
                </Headline>
                <div className={style.buttons}>
                    <ResetButton
                        onClick={({ target }) =>
                            assignedAssetsReset(target as HTMLButtonElement)
                        }
                        disabled={isUpdating}
                    >
                        Cancel
                    </ResetButton>

                    <Button
                        type="submit"
                        className={style.save}
                        disabled={
                            isChanged ||
                            isUpdating ||
                            externalLoad ||
                            Boolean(duplicateOrgError) ||
                            Boolean(duplicateIdError)
                        }
                        variant={isSavedMessageActive ? "valid" : undefined}
                    >
                        {isSavedMessageActive ? (
                            <>
                                <CheckSVG
                                    aria-hidden="true"
                                    width={17}
                                    height={17}
                                    fill="currentColor"
                                />
                                Saved
                            </>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </div>
            </header>
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
                />
                <Input
                    externalSetter={setCustomerID}
                    value={customerCrmId}
                    label="CRM Customer ID"
                    maxLength={32}
                    className={style.input}
                    error={duplicateIdError}
                    disabled={isUpdating}
                />

                <InputURL
                    externalSetter={setCustomerLink}
                    value={customerCrmLink}
                    label="CRM Customer ID Link"
                    maxLength={72}
                    className={style.input}
                    disabled={isUpdating}
                />

                <Multiselect
                    options={options}
                    label="Org. Assets"
                    selected={assignedAssets}
                    setSelected={setAssignedAssets}
                    errorMessage="Select asset permissions to assign to the organization."
                    showError={assetError}
                    className={style.input}
                    disabled={isUserOrganization}
                    type="edit-organization"
                    inputList={[...assignedAssets]
                        .map((asset) => asset.asset.name)
                        .join(", ")}
                    fullDisabled={isUpdating}
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
                />
            </div>
        </form>
    );
};

export default EditOrganizationForm;
