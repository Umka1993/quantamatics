import React, {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import Checkbox from "../app-checkbox/checkbox";
import { AssetListItem } from "../../types/asset";
import useChangeSet from "../../hooks/useChangeSet";
export interface MultiselectAssetOptionProps {
    selected: boolean;
    setSelected: Dispatch<SetStateAction<Set<string | number>>>;
    option: AssetListItem;
    type?: "edit-organization" | "user";

    disabled?: boolean;
}

const MultiselectAssetOption: FunctionComponent<
    MultiselectAssetOptionProps
> = ({ selected, option, type, setSelected, disabled }) => {
    const isUserMode = type === "user";

    const [isSelected, setIsSelected] = useState(selected);

    const showLabel = isUserMode && option.sharedByDefault;

    const [addToSelected, removeFromSelected] = useChangeSet(
        option.assetId,
        setSelected
    );

    useEffect(() => {
        isSelected ? addToSelected() : removeFromSelected();
    }, [isSelected]);

    return (
        <div className="multiselect__option">
            <Checkbox
                name={option.name}
                externalSetter={setIsSelected}
                checked={isSelected}
                disabled={isUserMode ? option.sharedByDefault : disabled}
                highlightOnChecked
                value={option.assetId}
                textTitle={option.name}
                labelCheckbox={showLabel ? "Is set as default" : undefined}
            >
                {option.name}
            </Checkbox>
        </div>
    );
};

export default MultiselectAssetOption;
