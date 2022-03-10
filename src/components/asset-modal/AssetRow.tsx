import React, {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import Checkbox from "../app-checkbox/checkbox";
import classNames from "classnames";
import { AssetInOrganization } from "../../types/asset";
import PinButton from "../pin-button";
import style from "./AssetModal.module.scss";

export interface MultiselectAssetOptionProps {
    selected: AssetInOrganization[];
    setSelected: Dispatch<SetStateAction<AssetInOrganization[]>>;
    option: AssetInOrganization;
    disabled?: boolean;
    setChange: () => void;
}

const AssetRow: FunctionComponent<MultiselectAssetOptionProps> = ({
    selected,
    option,
    setSelected,
    disabled,
    setChange,
}) => {
    const selectedID = selected.findIndex(
        ({ assetId }) => assetId === option.assetId
    );
    const isSelected = selectedID !== -1;
    const isPinned = isSelected ? selected[selectedID].sharedByDefault : false;

    const addToSelected = (sharedByDefault: boolean) =>
        setSelected([...selected, { ...option, sharedByDefault }]);

    const removeFromSelected = () =>
        setSelected(
            [...selected].filter(({ assetId }) => assetId !== option.assetId)
        );

    return (
        <tr className={classNames(style.row, style.asset)}>
            <td>{option.asset.name}</td>

            <td className={style.action}>
                <Checkbox
                    name={option.asset.name}
                    checked={isSelected}
                    disabled={disabled}
                    highlightOnChecked
                    value={option.assetId}
                    textTitle={option.asset.name}
                    onChange={() => {
                        setChange();
                        isSelected ? removeFromSelected() : addToSelected(false);
                    }}
                />
            </td>
            <td className={style.action}>
                <PinButton
                    checked={isPinned}
                    onClick={() => {
                        setChange();
                        if (isSelected) {
                            const copySelected = [...selected];
                            copySelected[selectedID] = {
                                ...copySelected[selectedID],
                                sharedByDefault: !isPinned,
                            };
                            setSelected(copySelected);
                        } else {
                            !isPinned && addToSelected(true);
                        }
                    }}
                    aria-label="Set as default for all user accounts"
                />
            </td>
        </tr>
    );
};

export default AssetRow;
