import React, {
    useState,
    useEffect,
    useRef,
    InputHTMLAttributes,
    ChangeEventHandler,
    FormEventHandler,
} from "react";
import "./styles/input.scss";
import classNames from "classnames";

interface IEmail extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    externalSetter?: (value: string) => void;
    hideError?: boolean;
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
    name,
    ...other
}) => {
    const [innerValue, setInnerValue] = useState<string>(value as string);
    const inputRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(error);

    // check if any label is provided
    let labelText = label ? label : placeholder;
    labelText = labelText ? labelText : "Enter text";

    const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
        const { value } = evt.target;
        setInnerValue(value);
        externalSetter && externalSetter(value);
        onChange && onChange(evt);
    };

    const blurHandler: ChangeEventHandler<HTMLInputElement> = ({target : {value}}) => {
        if (!value.includes('@')) {
            setInnerValue(`${value}@gmail.com`);
            externalSetter && externalSetter(`${value}@gmail.com`);
        }
    }

    useEffect(() => {
        setInnerValue(value as string);
    }, [value]);

    const getValidationMessage = (validity: ValidityState, error?: undefined | string) => {   
        if (error) {
            return error;
        }

        const {patternMismatch} = validity;

        if (patternMismatch) {
            return 'This is not a valid email';
        }

        return "";
    };

    useEffect(() => {
        if (inputRef.current) {            
            const { validity } = inputRef.current;
            inputRef.current.setCustomValidity(getValidationMessage(validity, error));

            if (Boolean(innerValue.length)) {
                !inputRef.current.validationMessage.length && setErrorMessage(undefined)
            }
        }
    }, [inputRef.current?.validity, error, innerValue]);

    const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
        evt.preventDefault();
        setErrorMessage(inputRef.current?.validationMessage);
        onInvalid && onInvalid(evt);
    };

    return (
        <div
            className={classNames("app-input", className, {
                "app-input--validate": errorMessage,
            })}
        >
            <div className="app-input__wrapper">
                <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className="app-input__field"
                    onChange={changeHandler}
                    onBlur={blurHandler}
                    aria-invalid={!!errorMessage}
                    aria-label={errorMessage && hideError ? errorMessage : labelText}
                    name={name}
                    aria-describedby={name && errorMessage ? name + "_error" : undefined}
                    placeholder={`${placeholder}${required ? "*" : ""}`}
                    required={required}
                    aria-required={required}
                    value={innerValue}
                    {...other}
                    ref={inputRef}
                    onInvalid={invalidHandler}
                    pattern={EMAIL_REG_EXP}
                />
            </div>

            {errorMessage && !hideError && (
                <p id={name && errorMessage ? name + "_error" : undefined} className="app-input__error">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default Email;
