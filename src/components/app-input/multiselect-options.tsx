import React, { FunctionComponent, Dispatch, SetStateAction, useCallback } from "react";
import Checkbox from "../app-checkbox/checkbox";
import classNames from "classnames";
import { AssetListItem } from "../../types/asset";
import PinButton from "../pin-button";

interface Options {
    options: AssetListItem[];
    selected: AssetListItem[];
    setSelected: Dispatch<SetStateAction<AssetListItem[]>>;
    disabled?: boolean;
    hidden?: boolean;
    setAssetsToUpdateShared?: Dispatch<SetStateAction<string[]>>;
    assetsToUpdateShared?: string[];
}

const MultiselectOptions: FunctionComponent<Options> = ({
    options,
    setSelected,
    selected,
    disabled,
    hidden,
    setAssetsToUpdateShared,
    assetsToUpdateShared,
}) => {
    const isOrganizationMode = assetsToUpdateShared && setAssetsToUpdateShared;
    return (
        <div
            className={classNames("multiselect__options", {
                // 'multiselect__options--ods': options.length % 2 !== 0
            })}
            hidden={hidden}
            aria-hidden={hidden}
        >
            {Array.from(options).map((option) => {
                const isSharedWillBeUpdated = assetsToUpdateShared?.includes(
                    option.assetId as string
                );
                const showLabel = !isOrganizationMode && option.sharedByDefault;

                const isPinChecked = isSharedWillBeUpdated
                    ? !option.sharedByDefault
                    : option.sharedByDefault;

                const addToSelected = () => setSelected([...selected, option]);
                const removeFromSelected = () => setSelected([
                    ...selected.filter(
                        ({ assetId }) => assetId !== option.assetId
                    ),
                ]);

                const unpinAsset = useCallback(() => {
                    if (setAssetsToUpdateShared && assetsToUpdateShared) {
                        return setAssetsToUpdateShared([
                            ...assetsToUpdateShared.filter(
                                (item) => item !== option.assetId
                            )])
                    }
                }, [setAssetsToUpdateShared]);

                const togglePin = useCallback(() => {
                    if (assetsToUpdateShared && setAssetsToUpdateShared) {
                        if (isSharedWillBeUpdated) {
                            setAssetsToUpdateShared([
                                ...assetsToUpdateShared.filter(
                                    (item) => item !== option.assetId
                                )])
                        } else {
                            setAssetsToUpdateShared(
                                [...assetsToUpdateShared, option.assetId as string])

                            !isSelected && addToSelected();
                        }
                    }
                }, [setAssetsToUpdateShared])

                const isSelected = selected.findIndex(
                    (asset) => asset.assetId === option.assetId
                ) !== -1


                return (
                    <div
                        className={classNames("multiselect__option", {
                            "multiselect__option--pinned": isOrganizationMode,
                            "multiselect__option--label": showLabel,
                            "multiselect__option--hide-pin":
                                isOrganizationMode && !isPinChecked,
                        })}
                        key={option.assetId}
                        aria-label={showLabel ? "Is set as default" : undefined}
                    >
                        {isOrganizationMode && (
                            <PinButton
                                checked={isPinChecked}
                                onClick={togglePin}
                                aria-label="Set as default for all user accounts"
                            />
                        )}
                        <Checkbox
                            name={option.name}
                            onInput={({ currentTarget }) => {
                                if ((currentTarget as any).checked) {
                                    addToSelected()
                                } else {
                                    removeFromSelected()
                                    isPinChecked && togglePin()
                                }
                            }
                            }
                            checked={isSelected}
                            disabled={isOrganizationMode ? disabled : option.sharedByDefault}
                            highlightOnChecked
                            value={option.assetId}
                        >
                            {option.name}
                        </Checkbox>
                    </div>
                );
            })}
        </div >
    );
};

export default MultiselectOptions;
