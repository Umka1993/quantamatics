import React, {
    useState,
    FunctionComponent,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";
import Checkbox from "../app-checkbox/checkbox";
import classNames from "classnames";
import { AssetInOrganization, AssetListItem } from "../../types/asset";
import PinButton from "../pin-button";

export interface MultiselectAssetOptionProps {
    selected: AssetInOrganization[];
    setSelected: Dispatch<SetStateAction<AssetInOrganization[]>>
    option: AssetInOrganization;
    disabled?: boolean;
}

const MultiselectAssetOrgOption: FunctionComponent<
    MultiselectAssetOptionProps
> = ({
    selected,
    option,
    setSelected,
    disabled
}) => {
        const checkIsSelected = () => selected.findIndex(({ assetId }) => assetId === option.assetId) !== -1
        const [isSelected, setIsSelected] = useState(checkIsSelected());
        const [isPinned, setIsPinned] = useState(option.sharedByDefault);

        const addToSelected = () => setSelected([...selected, option]);
        const removeFromSelected = () => setSelected([...selected].filter(({ assetId }) => assetId !== option.assetId));

        useEffect(() => {
            if (isSelected !== checkIsSelected()) {
                isSelected ? addToSelected() : removeFromSelected();
            }

        }, [isSelected, selected]);

        useEffect(() => {
            !isSelected && isPinned && setIsPinned(false)
        }, [isPinned, isSelected]);

        useEffect(() => {
            const selectedAssetID = selected.findIndex(({ assetId }) => assetId === option.assetId);

            // selectedAssetID === -1 && setIsPinned(false)

            if (selectedAssetID !== -1 && selected[selectedAssetID].sharedByDefault !== isPinned) {
                const copySelected = [...selected];

                copySelected[selectedAssetID] = { ...copySelected[selectedAssetID], sharedByDefault: isPinned }

                setSelected(copySelected)
            }

        }, [isPinned, selected]);

        return (
            <div
                className={classNames("multiselect__option", "multiselect__option--pinned", {
                    "multiselect__option--hide-pin": !isPinned,
                })}
            >

                <PinButton
                    checked={isPinned}
                    onClick={() => {
                        !isPinned && setIsSelected(true)
                        setIsPinned((prevVal) => !prevVal);
                        // updateWillToggleSharedByDefault();
                    }}
                    aria-label="Set as default for all user accounts"
                />

                <Checkbox
                    name={option.asset.name}
                    externalSetter={setIsSelected}
                    checked={isSelected}
                    disabled={disabled}
                    highlightOnChecked
                    value={option.assetId}
                    textTitle={option.asset.name}
                >
                    {option.asset.name}
                </Checkbox>
            </div>
        );
    };

export default MultiselectAssetOrgOption;
