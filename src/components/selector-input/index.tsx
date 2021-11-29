import React, { useState } from "react";
import "./styles/input.scss";
import classNames from "classnames";
import SVG from "../SVG";
import arrowIcon from "./assets/arrow.svg";

interface ISelectorInput {
    className?: string;
    placeholder?: string;
    value?: any;
    options: string[];
    required?: boolean;
    errors?: boolean;
    disabled?: boolean;
    values?: string[];
    valueSetter?: any;
    optionSetter?: any;
}

export const SelectorInput: React.FunctionComponent<ISelectorInput> = ({className, values, valueSetter, optionSetter, placeholder, value, required, errors, options, disabled }) => {
    const [selecting, setSelecting] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>(value);

    const inputClassNames = classNames("selector-input", className, {
        error: errors,
        "selector-input__active": selecting,
        "selector-input--disabled": disabled,
    });

    const optionsMap = options.map((item, index) => (
        <div 
            key={item + index} className="selector-input__item" 
            onClick={() => {
                // valueSetter && values && valueSetter(values[index]);
                optionSetter && optionSetter(item);
                setSelected(item)
                setSelecting(false);
            }}
            // data-value={values ? values[index] : undefined}
        >
            {item}
        </div>
    ));

    const changeState = () => {
        if (!disabled) {
            setSelecting(!selecting)
        }
    }

    return (
        <div className={inputClassNames} onClick={changeState}>
            <div className="selector-input__value">{selected}</div>
            <SVG icon={arrowIcon} />
            {selecting && <div className="selector-input__list">{optionsMap}</div>}
        </div>
    );
};
