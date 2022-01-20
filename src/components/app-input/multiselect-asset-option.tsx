import React, {
    useState,
    FunctionComponent,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";
import Checkbox from "../app-checkbox/checkbox";
import classNames from "classnames";
import { AssetListItem } from "../../types/asset";
import PinButton from "../pin-button";

export interface MultiselectAssetOptionProps {
    selected: boolean;
    setSelected: Dispatch<SetStateAction<Set<string | number>>>;
    option: AssetListItem;
    type?: "edit-organization" | "user";

    setAssetsToUpdateShared?: Dispatch<SetStateAction<Set<string | number>>>;
    assetsToUpdateShared?: Set<string | number>;
    disabled?: boolean;
}

const MultiselectAssetOption: FunctionComponent<
    MultiselectAssetOptionProps
> = ({
    selected,
    option,
    type,
    setSelected,
    setAssetsToUpdateShared,
    assetsToUpdateShared,
    disabled
}) => {
        const isOrganizationMode = type === "edit-organization";
        const isUserMode = type === "user";

        const [isSelected, setIsSelected] = useState(selected);
        const [isPinned, setIsPinned] = useState(option.sharedByDefault);

        const showLabel = isUserMode && option.sharedByDefault;

        const addAssetIdToState = (prevSet: any) =>
            new Set([...prevSet, option.assetId]);
        const removeAssetIdFromState = (prevSet: any) =>
            new Set([...prevSet].filter((assetID) => assetID !== option.assetId));

        const addToSelected = () => setSelected(addAssetIdToState);
        const removeFromSelected = () => setSelected(removeAssetIdFromState);

        useEffect(() => {
            isSelected ? addToSelected() : removeFromSelected();
        }, [isSelected]);

        useEffect(() => {
            !isSelected && isPinned && setIsPinned(false)
        }, [isPinned, isSelected]);

        const updateWillToggleSharedByDefault = () => {
            if (assetsToUpdateShared && setAssetsToUpdateShared) {
                assetsToUpdateShared.has(option.assetId as string)
                    ? setAssetsToUpdateShared(removeAssetIdFromState)
                    : setAssetsToUpdateShared(addAssetIdToState);
            }
        };

        return (
            <div
                className={classNames("multiselect__option", {
                    "multiselect__option--pinned": isOrganizationMode,
                    "multiselect__option--label": showLabel,
                    "multiselect__option--hide-pin": isOrganizationMode && !isPinned,
                })}
                key={option.assetId}
                aria-label={showLabel ? "Is set as default" : undefined}
            >
                {isOrganizationMode && (
                    <PinButton
                        checked={isPinned}
                        onClick={() => {
                            !isPinned && setIsSelected(true)
                            setIsPinned((prevVal) => !prevVal);
                            updateWillToggleSharedByDefault();
                        }}
                        aria-label="Set as default for all user accounts"
                    />
                )}
                <Checkbox
                    name={option.name}
                    externalSetter={setIsSelected}
                    checked={isSelected}
                    disabled={isUserMode ? option.sharedByDefault : disabled}
                    highlightOnChecked
                    value={option.assetId}
                >
                    {option.name}
                </Checkbox>
            </div>
        );
    };

export default MultiselectAssetOption;
