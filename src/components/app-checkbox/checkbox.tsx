import React, { FunctionComponent, HTMLProps } from "react";
import "./style/checkbox.scss";
import CheckIcon from "./assets/check.svg";
interface CheckboxProps extends HTMLProps<HTMLInputElement> { }

const Checkbox: FunctionComponent<CheckboxProps> = ({ ...other }) => {
    return (
        <>
            <input type="checkbox" className="check-block__input" {...other} />
            <span className="check-block__custom">
                <CheckIcon
                    width={10}
                    height={8}
                    aria-hidden
                    className="check-block__check"
                />
            </span>
        </>
    );
};

export default Checkbox;
