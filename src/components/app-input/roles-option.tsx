import React, {
    useState,
    FunctionComponent,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";
import Checkbox from "../app-checkbox/checkbox";
import { UserRole } from "../../data/enum";
import { Option } from "../../types/option";
import useChangeSet from "../../hooks/useChangeSet";
export interface RolesOptionProps {
    selected: boolean;
    setSelected: Dispatch<SetStateAction<Set<UserRole>>>
    option: Option<UserRole>;

    disabled?: boolean;

}

const RolesOption: FunctionComponent<
    RolesOptionProps
> = ({
    selected,
    option,
    setSelected
}) => {


        const [isSelected, setIsSelected] = useState(selected);


        const [addToSelected, removeFromSelected] = useChangeSet(option.value, setSelected)

        useEffect(() => {
            isSelected ? addToSelected() : removeFromSelected();
        }, [isSelected]);

        return (
            <div
                className="multiselect__option"
            >
                <Checkbox
                    name={option.value}
                    externalSetter={setIsSelected}
                    checked={isSelected}
                    highlightOnChecked
                >
                    {option.label}
                </Checkbox>
            </div>
        );
    };

export default RolesOption;
