import React, {
    ChangeEvent,
    Dispatch,
    FunctionComponent,
    LabelHTMLAttributes,
    SetStateAction,
    FormEventHandler
} from "react";
import "./style/checkbox.scss";
import CheckIcon from "./assets/check.svg";

interface CheckboxProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'onInput'> {
    name?: string;
    checked?: boolean;
    externalSetter?: Dispatch<SetStateAction<boolean>>;
    onInput?: FormEventHandler<HTMLInputElement>
}

const Checkbox: FunctionComponent<CheckboxProps> = ({
    children,
    checked,
    className,
    name,
    onInput,
    externalSetter,
    ...other
}) => {
    function inputHandler(evt: ChangeEvent<HTMLInputElement>) {
        externalSetter && externalSetter(evt.target.checked);
        onInput && onInput(evt);
    }
    return (
        <label className={["check-block", className].join(" ")} {...other}>
            <span className="check-block__wrapper">
                <input
                    type="checkbox"
                    name={name}
                    // checked=
                    defaultChecked={checked}
                    onInput={inputHandler}
                    className="check-block__input"
                />
                <CheckIcon
                    width="16"
                    height="16"
                    aria-hidden="true"
                    className="check-block__check"
                />
            </span>
            {children}
        </label>
    );
};

export default Checkbox;
