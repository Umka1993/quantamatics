import React, {
    ChangeEvent,
    Dispatch,
    FunctionComponent,
    LabelHTMLAttributes,
    SetStateAction,
    FormEventHandler,
    useEffect,
} from "react";
import "./style/checkbox.scss";
import CheckIcon from "./assets/check.svg";
import classNames from "classnames";
import { useRef } from "react";

interface CheckboxProps
    extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "onInput"> {
    name?: string;
    checked: boolean;
    externalSetter?: Dispatch<SetStateAction<boolean>>;
    align?: "right" | "left";
    disabled?: boolean;
    highlightOnChecked?: boolean;
    value?: string | number;
}

const Checkbox: FunctionComponent<CheckboxProps> = ({
    children,
    checked,
    className,
    name,
    externalSetter,
    align = "left",
    disabled,
    highlightOnChecked,
    defaultChecked,
    value,
    ...other
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    function inputHandler(evt: ChangeEvent<HTMLInputElement>) {
        externalSetter && externalSetter((value) => !value);
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.checked = checked;
        }
    }, [checked, inputRef.current]);
    return (
        <label
            className={classNames(
                "check-block",
                {
                    "check-block--right": align === "right",
                    "check-block--highlight": highlightOnChecked,
                },
                className
            )}
            {...other}
        >
            <input
                type="checkbox"
                name={name}
                defaultChecked={checked}
                onChange={inputHandler}
                className="check-block__input"
                disabled={disabled}
                value={value}
                ref={inputRef}
            />

            <span className="check-block__custom">
                <CheckIcon
                    width="16"
                    height="16"
                    aria-hidden="true"
                    className="check-block__check"
                />
            </span>

            <span className="check-block__text">{children}</span>
        </label>
    );
};

export default Checkbox;
