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
import { IMaskInput } from "react-imask";

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
    onFocus,
    ...other
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );
    const [rightOffset, setRightOffset] = useState<number>(20);

    const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
        let normalizedValue = evt.currentTarget.value;

        normalizedValue = normalizedValue.replace(
            /(http[s]?:\/\/){2,}/gm,
            "https://"
        );

        const isNeedToAddHTTP =
            normalizedValue.length <= 4 && !"http".includes(normalizedValue);

        if (isNeedToAddHTTP) {
            normalizedValue = "https://" + normalizedValue;
        }

        if (externalSetter) {
            externalSetter(normalizedValue);
        } else {
            evt.currentTarget.value = normalizedValue;
        }

        onChange && onChange(evt);
    };

    useEffect(() => {
        reCalcLabelWidth();
        if (inputRef.current) {
            console.log(inputRef.current);

            const { validationMessage, validity, value, required } = inputRef.current;

            const isOnlySpaces = /^\s+$/.test(value);

            if (required && (validity.valueMissing || isOnlySpaces)) {
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

    const focusHandler: FocusEventHandler<HTMLInputElement> = (evt) => {
        reCalcLabelWidth();
        onFocus && onFocus(evt);
    };

    const blurHandler: FocusEventHandler<HTMLInputElement> = (evt) => {
        const { value } = evt.currentTarget;
        if (
            value === "https://" ||
            value === "http://" ||
            (value.length < 6 && "https".includes(value)) ||
            (value.length < 5 && "http".includes(value))
        ) {
            if (externalSetter) {
                externalSetter("");
            } else evt.currentTarget.value = "";
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
                <IMaskInput
                    mask="{http}[s]://`*[***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************]"
                    definitions={{
                        s: /s/,
                    }}
                    className="app-input__field"
                    aria-invalid={!!errorMessage}
                    autoComplete={autoComplete}
                    placeholder={label ? " " : placeholder}
                    required={required}
                    aria-required={required}
                    value={value || ""}
                    maxLength={maxLength}
                    type="url"
                    onFocus={focusHandler}
                    {...other}
                    onInvalid={invalidHandler}
                    onBlur={blurHandler}
                    onAccept={(value) => {
                        //* delete duplicate http
                        const normalizedValue = (value as string).replace(
                            /(http[s]?:\/\/){2,}/gm,
                            "https://"
                        );
                        externalSetter && externalSetter(normalizedValue);
                    }}
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
