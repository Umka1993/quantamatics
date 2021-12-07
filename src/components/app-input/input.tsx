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
    // const [innerValue, setInnerValue] = useState<string>(value as string);
    const inputRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );
    const [rightOffset, setRightOffset] = useState<number>(20);

    const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
        const { value } = evt.target;
        externalSetter && externalSetter(value);
        onChange && onChange(evt);
    };

    useEffect(() => {
        reCalcLabelWidth();
        if (inputRef.current) {
            error && inputRef.current.setCustomValidity(error);

            if (value && Boolean(String(value).length)) {
                !inputRef.current.validationMessage.length &&
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
            setRightOffset(icon ? offsetWidth + 25 : offsetWidth + 5)
        }
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
                            "--label-width": `${rightOffset}px`,
                        } as CSSProperties
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
                    {...other}
                    ref={inputRef}
                    onInvalid={invalidHandler}
                    onFocus={(evt) => { reCalcLabelWidth(); onFocus && onFocus(evt) }}
                />
                {icon === "edit" && <EditIcon className="app-input__icon" />}
                {label && (
                    <span
                        className={classNames("app-input__label", {
                            'app-input__label--icon': icon
                        })}

                    >
                        <span ref={labelRef}>{label}{showLimit && maxLength && ` (${(value as string)?.length} / ${maxLength})`}</span>
                    </span>
                )}
            </label>

            {errorMessage && errorMessage.length && (
                <p className="app-input__error">{errorMessage}</p>
            )}
        </div>
    );
};

export default Input;