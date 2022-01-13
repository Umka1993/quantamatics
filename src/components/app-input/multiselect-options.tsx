import React, { FunctionComponent, Dispatch, SetStateAction } from "react";
import Checkbox from "../app-checkbox/checkbox";
import classNames from "classnames";
import { AssetListItem } from "../../types/asset";

interface Options {
    options: AssetListItem[];
    selected: AssetListItem[];
    setSelected: Dispatch<SetStateAction<AssetListItem[]>>;
    disabled?: boolean;
    hidden?: boolean
}

const MultiselectOptions: FunctionComponent<Options> = ({
    options,
    setSelected,
    selected,
    disabled,
    hidden
}) => {
    return (
        <div
            className={classNames("multiselect__options", {
                // 'multiselect__options--ods': options.length % 2 !== 0
            })}
            hidden={hidden}
            aria-hidden={hidden}
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
                                setSelected([...selected.filter(asset => asset.assetId !== option.assetId)])
                            }
                        }}
                        checked={
                            selected.findIndex((asset) => asset.assetId === option.assetId) >=
                            0
                        }
                        disabled={disabled}
                        highlightOnChecked
                        value={option.assetId}
                    >
                        {option.name}
                    </Checkbox>
                );
            })}
        </div>
    );
};

export default MultiselectOptions;
