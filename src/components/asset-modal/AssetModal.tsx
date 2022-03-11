import SaveResetHeader from "../save-reset-header/SaveResetHeader";
import React, {
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
    Dispatch,
    FormEvent,
    useRef,
    useCallback,
} from "react";
import { HTMLProps } from "react";
import Dialog from "../dialog";
import style from "./AssetModal.module.scss";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";
import { AssetInOrganization } from "types/asset";
import AssetRow from "./AssetRow";

import { SortDirection } from "../../data/enum";
import ISort from "../../types/sort-type";
import {
    useLazyGetOrganizationQuery,
    useUpdateOrganizationMutation,
} from "../../api/organization";
import { Organization } from "../../types/organization/types";
import useUser from "../../hooks/useUser";

interface AssetModalProps extends Omit<HTMLProps<HTMLDivElement>, "selected"> {
    open: boolean;
    closeFunction: () => void;
    organization: Organization;
}

const AssetModal: FunctionComponent<AssetModalProps> = ({
    closeFunction,
    open,
    // selected,
    // setSelected,
    organization,
    ...other
}) => {
    const user = useUser();
    const [noAssetError, setNoAssetError] = useState(false);

    const [hasChanges, setHasChanges] = useState(false);

    const [hasError, setError] = useState(false);

    const errorRef = useRef<HTMLParagraphElement>(null);

    const [selected, setSelected] = useState(organization.organizationAssets);

    const INITIAL_SORT = { name: "name", direction: SortDirection.Default };
    const [sort, setSort] = useState<ISort>(INITIAL_SORT);
    const [options, setOptions] = useState<AssetInOrganization[]>([]);


    const [
        update,
        {
            isSuccess: isUpdated,
            isLoading: isUpdating,
            isError: isUpdateError,
            error: updateError,
        },
    ] = useUpdateOrganizationMutation();
    const [getInfoOrg] = useLazyGetOrganizationQuery();

    const isUserOrganization = user?.organizationId === organization?.id;

    const setInitialOrg = useCallback(() => {
        if (organization) {
            setSelected(organization.organizationAssets);
        }
    }, [organization]);

    useEffect(() => {
        organization && setInitialOrg();
    }, [organization]);

    const assetsReset = useCallback(
        () => organization && setSelected(organization.organizationAssets),
        [organization]
    );

    function initOptions() {
        if (organization && user) {
            const prepareOptions = (allAssets: AssetInOrganization[]) => {
                const transformedOptions = [...allAssets].map((asset) => {
                    const alreadySelectedAsset = organization.organizationAssets.find(
                        ({ assetId }) => assetId === asset.assetId
                    );

                    return alreadySelectedAsset === undefined
                        ? { ...asset, organizationId: organization.id }
                        : alreadySelectedAsset;
                });
                sessionStorage.setItem(
                    "asset-rows",
                    JSON.stringify(transformedOptions)
                );

                setOptions(transformedOptions);
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

    useEffect(() => {
        isUpdating && setTimeout(closeFunction, 800);
    }, [isUpdating]);

    function checkErrorsOrClose() {
        if (hasChanges && !hasError) {
            setError(true);
            return;
        }

        if (!hasChanges || hasError) {
            setError(false);
            assetsReset();
            closeFunction();
        }
    }

    function resetHandler(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        checkErrorsOrClose();
    }

    useEffect(() => {
        if (hasError && errorRef.current) {
            errorRef.current.focus();
        }
    }, [hasError, errorRef.current]);

    useEffect(() => {
        if (organization) {
            const isQuickChanged =
                organization.organizationAssets.length !== selected.length;

            if (isQuickChanged) {
                setHasChanges(true);
            } else {
                let isSharedChanged = false;
                selected.forEach((asset) => {
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
                setHasChanges(isSharedChanged);
            }
        }
    }, [selected, organization]);

    function submitHandler(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        if (!selected.length) {
            setError(true)
            return setNoAssetError(true);
        }

        if (organization) {
            update({
                ...organization,
                organizationAssets: [...selected].map((asset) => ({
                    ...asset,
                    asset: null,
                })),
            });
        }
    }

    return (
        <Dialog
            id="asset-modal"
            variant="right-side"
            open={open}
            hasCloseButton={false}
            closeOnOutsideClick
            onRequestClose={checkErrorsOrClose}
            {...other}
        >
            <form
                className={style.root}
                onReset={resetHandler}
                onSubmit={submitHandler}
                method="dialog"
            >
                <SaveResetHeader
                    headline="Application Assets"
                    disableReset={false}
                    disableSave={!hasChanges || noAssetError}
                    isSavedMessageActive={isUpdating}
                    headlineID="asset-modal-title"
                    className={style.header}
                />
                {hasError && (
                    <p className={style.error} role="alert" ref={errorRef} tabIndex={0}>
                        {noAssetError
                            ? "Select asset permissions to assign to the organization."
                            : "Your changes will not be saved. Click again if you want to persist."}
                    </p>
                )}

                <table className={style.table}>
                    <thead>
                        <tr className={style.row}>
                            <SortTableHeader
                                name="name"
                                text="Name"
                                sort={sort}
                                localRows={options}
                                setSort={setSort}
                                setLocalRows={setOptions}
                                className={style.headline}
                                localKey="asset-rows"
                            />
                            <th className={[style.headline, style.action].join(" ")}>
                                Assign
                            </th>
                            <th className={[style.headline, style.action].join(" ")}>
                                Default
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Boolean(options.length) &&
                            options.map((option) => (
                                <AssetRow
                                    key={option.assetId}
                                    option={option}
                                    selected={selected}
                                    setSelected={setSelected}
                                    disabled={isUserOrganization}
                                />
                            ))}
                    </tbody>
                </table>
            </form>
        </Dialog>
    );
};

export default AssetModal;
