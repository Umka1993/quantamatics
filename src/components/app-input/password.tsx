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
import EyeSVG from "./assets/eye.svg";
import ClosedEyeSVG from "./assets/closed-eye.svg";
import getValidationMessage from "./utils/passwordValidation";

const PATTERN_PASSWORD =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\\[\\]\\\\\"';:<_>., =+/-]).*$";
interface IPassword extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    autoComplete?: "current-password" | "new-password";
    externalSetter?: (value: string) => void;
}

const Password: React.FunctionComponent<IPassword> = ({
    className,
    label,
    placeholder,
    required,
    pattern,
    name,
    value,
    onChange,
    onInvalid,
    autoComplete,
    externalSetter,
    error,
    ...other
}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [innerValue, setInnerValue] = useState<string>(value as string);
    const inputRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    // check if any label is provided
    let labelText = label ? label : placeholder;
    labelText = labelText ? labelText : "Password input";

    // check regexp
    let regularExp =
        autoComplete === "new-password" ? PATTERN_PASSWORD : undefined;
    regularExp = pattern ? pattern : regularExp;

    // Show/hide pass
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.type = showPassword ? "text" : "password";
        }
    }, [showPassword]);

    const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
        const { value } = evt.target;
        setInnerValue(value);
        externalSetter && externalSetter(value);
        onChange && onChange(evt);
    };

    useEffect(() => {
        if (inputRef.current) {
            const { validity } = inputRef.current;
            inputRef.current.setCustomValidity(getValidationMessage(validity, error));

            const { validationMessage } = inputRef.current;

            errorMessage &&
                errorMessage !== validationMessage &&
                setErrorMessage(validationMessage);

            !validationMessage.length && setErrorMessage(undefined);
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
                    className="app-input__field"
                    type="password"
                    onChange={changeHandler}
                    aria-invalid={!!errorMessage}
                    aria-label={showPassword ? "Password is open" : labelText}
                    name={name}
                    aria-describedby={name && errorMessage ? name + "_error" : undefined}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    required={required}
                    aria-required={required}
                    pattern={regularExp}
                    minLength={8}
                    value={innerValue}
                    {...other}
                    ref={inputRef}
                    onInvalid={invalidHandler}
                />

                <button
                    type="button"
                    role="switch"
                    aria-checked={showPassword}
                    aria-label="Show password"
                    onClick={() => setShowPassword(!showPassword)}
                    title="Show/hide password"
                    className="app-input__toggle"
                >
                    {showPassword ? (
                        <EyeSVG aria-hidden="true" />
                    ) : (
                        <ClosedEyeSVG aria-hidden="true" />
                    )}
                </button>
            </div>

            {errorMessage && errorMessage !== " " && (
                <p id={name ? name + "_error" : undefined} className="app-input__error">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default Password;
