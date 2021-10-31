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

const PATTERN_PASSWORD =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\\[\\]\\\\\"';:<_>., =+/-]).*$";

interface IPassword extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    autoComplete?: "current-password" | "new-password";
    externalSetter?: (value: string) => void;
    triggerValidity?: boolean;
}

const Password: React.FunctionComponent<IPassword> = ({
    className,
    label,
    placeholder,
    required,
    pattern,
    itemRef,
    value,
    onChange,
    onInvalid,
    autoComplete,
    externalSetter,
    error,
    triggerValidity,
    ...other
}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    // const [validate, setValidate] = useState<boolean>(false);
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

    // Validate
    const getValidationMessage = (validity: ValidityState): string => {
        if (error) {
            return error;
        }

        if (inputRef.current) {
            const { tooShort, patternMismatch } = validity;

            if (tooShort || patternMismatch) {
                const textStart = "The password must contain at least ";
                let requirements = [];

                tooShort && requirements.push("8 characters");
                patternMismatch &&
                    requirements.push(
                        "1 uppercase letter, 1 digit and 1 special character"
                    );

                return `${textStart} ${requirements.join(", ")}.`;
            }
        }

        return "";
    };

    useEffect(() => {
        if (inputRef.current) {
            const { validity } = inputRef.current;
            inputRef.current.setCustomValidity(getValidationMessage(validity));

            if (Boolean(innerValue.length)) {

                !inputRef.current.validationMessage.length && setErrorMessage(undefined)
                
                // inputRef.current.validationMessage.length
                //     ? inputRef.current.checkValidity()
                //     : setErrorMessage(undefined);
            }
        }
    }, [inputRef.current?.validity, error, innerValue]);

    const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
        evt.preventDefault();
        setErrorMessage(inputRef.current?.validationMessage);
        // setValidate(true);
        onInvalid && onInvalid(evt);
    };

    // useEffect(() => {
    //     if (triggerValidity && inputRef.current) {
    //         setValidate(true);
    //         inputRef.current.checkValidity();
    //     }
    // }, [triggerValidity]);

    return (
        <div
            className={classNames("app-input", className, {
                "app-input--validate": true,
            })}
            ref={itemRef}
        >
            <div className="app-input__wrapper">
                <input
                    className="app-input__field"
                    type="password"
                    onChange={changeHandler}
                    aria-invalid={!!errorMessage}
                    aria-label={showPassword ? "Password is open" : labelText}
                    // TODO: uniq ID aria-describedby="error_pw desc_pw"
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
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                    title="Show/hide password"
                    className="app-input__toggle"
                >
                    {showPassword ? <EyeSVG /> : <ClosedEyeSVG />}
                </button>
            </div>

            {errorMessage && <p className="app-input__error">{errorMessage}</p>}
        </div>
    );
};

export default Password;
