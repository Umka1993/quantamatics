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
    value,
    ...other
}) => {
    function inputHandler(evt: ChangeEvent<HTMLInputElement>) {
        externalSetter && externalSetter(evt.target.checked);
        onInput && onInput(evt);
    }
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
