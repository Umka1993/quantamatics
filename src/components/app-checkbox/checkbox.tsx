import React, {
    ChangeEvent,
    Dispatch,
    FunctionComponent,
    LabelHTMLAttributes,
    SetStateAction,
    FormEventHandler,
    InputHTMLAttributes
} from "react";
import "./style/checkbox.scss";
import CheckIcon from "./assets/check.svg";
import classNames from 'classnames'
import { useEffect } from "react";
import { useRef } from "react";

interface CheckboxProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'onInput'> {
    name?: string;
    checked?: boolean;
    externalSetter?: Dispatch<SetStateAction<boolean>>;
    onInput?: FormEventHandler<HTMLInputElement>;
    align?: 'right' | 'left';
    disabled?: boolean;
    highlightOnChecked?: boolean;
    value?: string | number;
}

const Checkbox: FunctionComponent<CheckboxProps> = ({
    children,
    checked,
    className,
    name,
    onInput,
    externalSetter,
    align = "left",
    disabled,
    highlightOnChecked,
    defaultChecked,
    value,
    ...other
}) => {
    const inputRef = useRef<HTMLInputElement>(null)
    function inputHandler(evt: ChangeEvent<HTMLInputElement>) {
        externalSetter && externalSetter(evt.target.checked);
        onInput && onInput(evt);
    }

    useEffect(() => {
        if (inputRef.current && checked) {
            console.log(checked);
            
            inputRef.current.checked = checked
        }

    }, [checked, inputRef.current])
    return (
        <label className={classNames("check-block", {
            'check-block--right': align === "right",
            'check-block--highlight': highlightOnChecked
        }, className)} {...other}>
            <input
                type="checkbox"
                name={name}
                defaultChecked={checked}
                onInput={inputHandler}
                className="check-block__input"
                disabled={disabled}
                value={value}
                ref={inputRef}
            />

            <CheckIcon
                width="16"
                height="16"
                aria-hidden="true"
                className="check-block__check"
            />

            <span className="check-block__custom">
                {children}
            </span>
        </label>
    );
};

export default Checkbox;
