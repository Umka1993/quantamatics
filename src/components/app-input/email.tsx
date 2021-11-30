import React, {
    useState,
    useEffect,
    useRef,
    InputHTMLAttributes,
    ChangeEventHandler,
    FormEventHandler,
    CSSProperties,
} from "react";
import "./styles/input.scss";
import classNames from "classnames";
import EditIcon from "./assets/edit.svg";
import getValidationMessage from "./utils/emailValidation";

interface IEmail extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    externalSetter?: (value: string) => void;
    hideError?: boolean;
    icon?: string;
}

const EMAIL_REG_EXP = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$";

const Email: React.FunctionComponent<IEmail> = ({
    className,
    label,
    placeholder,
    required,
    value,
    onChange,
    onInvalid,
    externalSetter,
    hideError = false,
    error,
    icon,
    name,
    onFocus,
    ...other
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(error);
    const [rightOffset, setRightOffset] = useState<number>(20);

    const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
        const { value } = evt.target;
        externalSetter && externalSetter(value);
        onChange && onChange(evt);
    };

    useEffect(() => {
        reCalcLabelWidth();
        if (inputRef.current) {
            const { validity } = inputRef.current;
            inputRef.current.setCustomValidity(getValidationMessage(validity, error));

            const { validationMessage } = inputRef.current;

            error &&
                errorMessage !== validationMessage &&
                setErrorMessage(validationMessage);

            !validationMessage.length && setErrorMessage(undefined);
        }
    }, [inputRef.current?.validity, error, value]);

    const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
        evt.preventDefault();
        setErrorMessage(inputRef.current?.validationMessage);
        onInvalid && onInvalid(evt);
    };

    const reCalcLabelWidth = () => {
        labelRef.current && setRightOffset(rightOffset);
    }

    return (
        <div
            className={classNames("app-input", className, {
                "app-input--validate": errorMessage,
            })}
        >
            <label
                className="app-input__wrapper"
                style={
                    label ?
                        {
                            "--label-width": `${labelRef.current?.offsetWidth}px`,
                        } as CSSProperties
                        : undefined
                }
            >
                <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className="app-input__field"
                    onChange={changeHandler}
                    onFocus={(evt) => {reCalcLabelWidth(); onFocus && onFocus(evt)}}
                    aria-invalid={!!errorMessage}
                    aria-label={errorMessage && hideError ? errorMessage : undefined}
                    name={name}
                    aria-describedby={name && errorMessage ? name + "_error" : undefined}
                    placeholder={label ? " " : placeholder}
                    required={required}
                    aria-required={required}
                    value={value || ""}
                    {...other}
                    ref={inputRef}
                    onInvalid={invalidHandler}
                    pattern={EMAIL_REG_EXP}
                />

                {icon === "edit" && <EditIcon className="app-input__icon app-input__icon--solo" />}
                {label && (
                    <span
                    className={classNames("app-input__label", {
                        'app-input__label--empty': !String(value).length,
                    })}
                        ref={labelRef}
                        data-width={labelRef.current?.offsetWidth}
                    >
                        {label}
                        {icon === "edit" && <EditIcon className="app-input__icon" />}
                    </span>
                )}
            </label>

            {errorMessage && !hideError && (
                <p
                    id={name && errorMessage ? name + "_error" : undefined}
                    className="app-input__error"
                >
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default Email;
