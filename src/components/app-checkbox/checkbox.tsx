import React, { FunctionComponent, HTMLProps } from "react";
import "./style/checkbox.scss";
import CheckIcon from "./assets/check.svg";
interface CheckboxProps extends HTMLProps<HTMLInputElement> { }

const Checkbox: FunctionComponent<CheckboxProps> = ({ ...other }) => {
    return (
        <>
            <input type="checkbox" className="check-block__input" {...other} />
            <CheckIcon
                width={16}
                height={16}
                aria-hidden
                className="check-block__check"
            />
        </>
    );
};

export default Checkbox;
