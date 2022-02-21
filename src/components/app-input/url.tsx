import React, {
    useState,
    useEffect,
    useRef,
    InputHTMLAttributes,
    ChangeEventHandler,
    FormEventHandler,
    CSSProperties,
    FocusEventHandler,
} from "react";
import "./styles/input.scss";
import classNames from "classnames";
import EditIcon from "./assets/edit.svg";

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    externalSetter?: (value: string) => void;
    icon?: string;
    showLimit?: boolean;
}

const Input: React.FunctionComponent<IInput> = ({
    className,
    label,
    placeholder,
    required,
    value,
    onChange,
    onInvalid,
    autoComplete,
    externalSetter,
    error,
    icon,
    maxLength,
    showLimit,
    ...other
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );
    const [rightOffset, setRightOffset] = useState<number>(20);

    const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
        externalSetter && externalSetter(evt.currentTarget.value)
        onChange && onChange(evt);
    };

    useEffect(() => {
        reCalcLabelWidth();
        if (inputRef.current) {
            const { validationMessage, validity, value, required } = inputRef.current;

            const isOnlySpaces = /^\s+$/.test(value);

            if (
                (required && (validity.valueMissing || isOnlySpaces)) ||
                (!validity.valueMissing && validity.patternMismatch)
            ) {
                inputRef.current.setCustomValidity(
                    `This is not valid ${label ? label : ""}`
                );
            } else {
                inputRef.current.setCustomValidity("");
            }
            error
                ? inputRef.current.setCustomValidity(error)
                : setErrorMessage(undefined);

            if (!validationMessage.length) {
                setErrorMessage(undefined);
            }
        }
    }, [inputRef.current?.validity, error, value]);

    const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
        evt.preventDefault();

        setErrorMessage(inputRef.current?.validationMessage);
        onInvalid && onInvalid(evt);
    };

    const reCalcLabelWidth = () => {
        if (labelRef.current) {
            const { offsetWidth } = labelRef.current;
            setRightOffset(icon ? offsetWidth + 25 : offsetWidth + 5);
        }
    };

    return (
        <div
            className={classNames("app-input", className, {
                "app-input--validate": errorMessage,
            })}
        >
            <label
                className="app-input__wrapper"
                style={
                    label
                        ? ({
                            "--label-width": `${rightOffset}px`,
                        } as CSSProperties)
                        : undefined
                }
            >
                <input
                    className="app-input__field"
                    onChange={changeHandler}
                    aria-invalid={!!errorMessage}
                    autoComplete={autoComplete}
                    placeholder={label ? " " : placeholder}
                    required={required}
                    aria-required={required}
                    value={value || ""}
                    maxLength={maxLength}
                    type="text"
                    pattern='.{1,}\..{1,}'
                    {...other}
                    ref={inputRef}
                    onInvalid={invalidHandler}
                />
                {icon === "edit" && <EditIcon className="app-input__icon" />}
                {label && (
                    <span
                        className={classNames("app-input__label", {
                            "app-input__label--icon": icon,
                        })}
                    >
                        <span ref={labelRef}>
                            {label}
                            {showLimit &&
                                maxLength &&
                                ` (${(value as string)?.length} / ${maxLength})`}
                        </span>
                    </span>
                )}
            </label>

            {errorMessage && <p className="app-input__error">{errorMessage}</p>}
        </div>
    );
};

export default Input;
