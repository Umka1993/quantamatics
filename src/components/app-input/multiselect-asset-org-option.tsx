import React, {Dispatch, FunctionComponent, SetStateAction, useEffect, useState,} from "react";
import Checkbox from "../app-checkbox/checkbox";
import classNames from "classnames";
import {AssetInOrganization} from "../../types/asset";
import PinButton from "../pin-button";

export interface MultiselectAssetOptionProps {
    selected: AssetInOrganization[];
    setSelected: Dispatch<SetStateAction<AssetInOrganization[]>>;
    option: AssetInOrganization;
    disabled?: boolean;
    setPinned?: (arg: boolean) => void
}

const MultiselectAssetOrgOption: FunctionComponent<MultiselectAssetOptionProps> = ({
                                                                                       selected,
                                                                                       option,
                                                                                       setSelected,
                                                                                       disabled,
                                                                                       setPinned,

                                                                                   }) => {
    const selectedID = selected.findIndex(
        ({assetId}) => assetId === option.assetId
    );
    const isSelected = selectedID !== -1;
    const isPinned = isSelected ? selected[selectedID].sharedByDefault : false;

    const addToSelected = (sharedByDefault: boolean) =>
        setSelected([...selected, {...option, sharedByDefault}]);
    const removeFromSelected = () =>
        setSelected(
            [...selected].filter(({assetId}) => assetId !== option.assetId)
        );


    return (
        <div
            className={classNames(
                "multiselect__option",
                "multiselect__option--pinned",
                {
                    "multiselect__option--hide-pin": !isPinned,
                }
            )}
        >
            <PinButton
                checked={isPinned}
                onClick={() => {
                    if (isSelected) {
                        const copySelected = [...selected];
                        copySelected[selectedID] = {
                            ...copySelected[selectedID],
                            sharedByDefault: !isPinned,
                        };
                        setSelected(copySelected);
                        setPinned && setPinned(copySelected[selectedID].sharedByDefault)
                    } else {
                        !isPinned && addToSelected(true)
                    }
                }}
                aria-label="Set as default for all user accounts"
            />

            <Checkbox
                name={option.asset.name}
                checked={isSelected}
                disabled={disabled}
                highlightOnChecked
                value={option.assetId}
                textTitle={option.asset.name}
                onChange={isSelected ? removeFromSelected : () => addToSelected(false)}
            >
                {option.asset.name}
            </Checkbox>
        </div>
    );
};

export default MultiselectAssetOrgOption;
