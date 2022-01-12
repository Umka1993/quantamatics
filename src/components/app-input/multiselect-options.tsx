import React, { FunctionComponent, Dispatch, SetStateAction } from "react";
import Checkbox from "../app-checkbox/checkbox";
import classNames from "classnames";
import { AssetListItem } from "../../types/asset";

interface Options {
    options: AssetListItem[];
    selected: AssetListItem[];
    setSelected: Dispatch<SetStateAction<AssetListItem[]>>;
    disabled?: boolean;
}

const MultiselectOptions: FunctionComponent<Options> = ({
    options,
    setSelected,
    selected,
    disabled
}) => {
    return (
        <div
            className={classNames("multiselect__options", {
                // 'multiselect__options--ods': options.length % 2 !== 0
            })}
        >
            {Array.from(options).map((option) => {
                return (
                    <Checkbox
                        name={option.name}
                        key={option.assetId}
                        onInput={({ currentTarget }) => {
                            if ((currentTarget as any).checked) {
                                setSelected([...selected, option]);
                            } else {
                                const deletedIndex = selected.indexOf(option);
                                const tempArray = [...selected];
                                tempArray.splice(deletedIndex, 1);
                                setSelected(tempArray);
                            }
                        }}
                        checked={
                            selected.findIndex((asset) => asset.assetId === option.assetId) >=
                            0
                        }
                        disabled={disabled}
                        highlightOnChecked
                    // value={option.assetId}
                    >
                        {option.name}
                    </Checkbox>
                );
            })}
        </div>
    );
};

export default MultiselectOptions;
