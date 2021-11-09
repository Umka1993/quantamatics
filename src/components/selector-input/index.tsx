import React, { useState } from "react";
import "./styles/input.scss";
import classNames from "classnames";
import SVG from "../SVG";
import arrowIcon from "./assets/arrow.svg";

interface ISelectorInput {
    className?: string;
    placeholder?: string;
    onChangeInput: (value: any) => void;
    value?: any;
    options: Array<string>;
    required?: boolean;
    errors?: boolean;
    disabled?: boolean;
}

export const SelectorInput: React.FunctionComponent<ISelectorInput> = ({className, placeholder, value, onChangeInput, required, errors, options, disabled }) => {
    const [selecting, setSelecting] = useState<boolean>(false);

    const inputClassNames = classNames("selector-input", className, {
        error: errors,
        "selector-input__active": selecting,
        "selector-input--disabled": disabled,
    });

    const optionsMap = options.map((item) =>
        <div className="selector-input__item" key={item} onClick={() => setSelecting(false)}>{item}</div>
    )

    const changeState = () => {
        if (!disabled) {
            setSelecting(!selecting)
        }
    }

    return (
        <div className={inputClassNames} onClick={changeState}>
            <div className="selector-input__value">{value}</div>
            <SVG icon={arrowIcon} />
            {selecting && <div className="selector-input__list">{optionsMap}</div>}
        </div>
    );
};
