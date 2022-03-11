import React, {
    useState,
    FunctionComponent,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";
import Checkbox from "../app-checkbox/checkbox";
import { AssetListItem } from "../../types/asset";
import { UserRole, UserRoleLabel } from "../../data/enum";
export interface RolesOptionProps {
    selected: boolean;
    setSelected: Dispatch<SetStateAction<UserRole[]>>
    option: UserRole;
    type?: "edit-organization" | "user";

    disabled?: boolean;
}

const RolesOption: FunctionComponent<
    RolesOptionProps
> = ({
    selected,
    option,
    type,
    setSelected,
    disabled
}) => {
        const isUserMode = type === "user";

        const [isSelected, setIsSelected] = useState(selected);

        const showLabel = isUserMode

        const addAssetIdToState = (prevSet: any) => {
            if (!prevSet.includes(option)) return [...prevSet, option];
            return prevSet
        }
        const removeAssetIdFromState = (prevSet: any) =>
            [...prevSet].filter((chosenOption) => chosenOption !== option);

        const addToSelected = () => setSelected(addAssetIdToState);
        const removeFromSelected = () => setSelected(removeAssetIdFromState);

        useEffect(() => {
            isSelected ? addToSelected() : removeFromSelected();
        }, [isSelected]);

        return (
            <div
                className="multiselect__option"
            >
                <Checkbox
                    name={option}
                    externalSetter={setIsSelected}
                    checked={isSelected}
                    highlightOnChecked
                >
                    <p>rer</p>
                    {/* {UserRoleLabel[option] as any} */}
                </Checkbox>
            </div>
        );
    };

export default RolesOption;
