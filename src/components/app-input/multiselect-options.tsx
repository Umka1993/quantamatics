import React, {
    FunctionComponent,
    Dispatch,
    SetStateAction,
} from "react";
import Checkbox from "../app-checkbox/checkbox";

interface Options {
    options: string[];
    selected: string[];
    setSelected: Dispatch<SetStateAction<string[]>>;
}

const MultiselectOptions: FunctionComponent<Options> = ({
    options,

    setSelected,
    selected,
}) => {
    return (
        <div className="multiselect__options">
            {Array.from(options).map((option) => (
                <Checkbox
                    name={option}
                    key={option}
                    onInput={({ currentTarget }) => {
                        if ((currentTarget as any).checked) {
                            setSelected([...selected, option]);
                        } else {
                            const deletedIndex = selected.indexOf(option)
                            const tempArray = [...selected]
                            tempArray.splice(deletedIndex, 1)
                            setSelected(tempArray);
                        }
                    }}
                    checked={selected.includes(option)}

                >
                    {option}
                </Checkbox>
            ))}
        </div>

    );
};

export default MultiselectOptions;
