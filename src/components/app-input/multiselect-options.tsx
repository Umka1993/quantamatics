import React, { FunctionComponent, Dispatch, SetStateAction } from "react";
import Checkbox from "../app-checkbox/checkbox";
import classNames from "classnames";
import { AssetListItem } from "../../types/asset";
import PinButton from "../pin-button";

export interface Options {
    options: AssetListItem[];
    selected: Set<string | number>;
    setSelected: Dispatch<SetStateAction<Set<string | number>>>;
    disabled?: boolean;
    hidden?: boolean;
    setAssetsToUpdateShared?: Dispatch<SetStateAction<Set<string | number>>>;
    assetsToUpdateShared?: Set<string | number>;
    type?: 'edit-organization' | 'user';
}

const MultiselectOptions: FunctionComponent<Options> = ({
    options,
    setSelected,
    selected,
    disabled,
    hidden,
    setAssetsToUpdateShared,
    assetsToUpdateShared,
    type
}) => {
    const isOrganizationMode = type === 'edit-organization'
    const isUserMode = type === 'user'
    return (
        <div
            className={classNames("multiselect__options", {
                // 'multiselect__options--ods': options.length % 2 !== 0
            })}
            hidden={hidden}
            aria-hidden={hidden}
        >
            {Array.from(options).map((option) => {
                const isSharedWillBeUpdated = assetsToUpdateShared?.has(
                    option.assetId as string
                );

                const showLabel = isUserMode && option.sharedByDefault;

                const isPinChecked = isSharedWillBeUpdated
                    ? !option.sharedByDefault
                    : option.sharedByDefault;

                const isSelected = selected.has(option.assetId);

                const addAssetIdToState = (prevSet: any) =>
                    new Set([...prevSet, option.assetId]);
                const removeAssetIdFromState = (prevSet: any) =>
                    new Set([...prevSet].filter((assetID) => assetID !== option.assetId));

                const addToSelected = () => setSelected(addAssetIdToState);
                const removeFromSelected = () => setSelected(removeAssetIdFromState);

                const togglePin = () => {
                    if (assetsToUpdateShared && setAssetsToUpdateShared) {
                        if (isSharedWillBeUpdated) {
                            setAssetsToUpdateShared(removeAssetIdFromState);
                        } else {
                            setAssetsToUpdateShared(addAssetIdToState);
                            !isSelected && addToSelected();
                        }
                    }
                };

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
                                    addToSelected();
                                } else {
                                    removeFromSelected();
                                    isPinChecked && togglePin();
                                }
                            }}
                            checked={isSelected}
                            disabled={isUserMode ? option.sharedByDefault : disabled}
                            highlightOnChecked
                            value={option.assetId}
                        >
                            {option.name}
                        </Checkbox>
                    </div>
                );
            })}
        </div>
    );
};

export default MultiselectOptions;
