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

// import useDebounce from "../../services/useDebounce";

export type ReactSVGComponent = React.FunctionComponent<
    React.SVGAttributes<SVGElement>
>;

const PATTERN_PASSWORD =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\\[\\]\\\\\"';:<_>., =+/-]).*$";

interface IPassword extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
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
    error,
    ...other
}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [dummy, setDummy] = useState<string>("");
    const [validate, setValidate] = useState<boolean>(false);
    const [innerValue, setInnerValue] = useState<string>(value as string);
    const inputRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    // check if any label is provided
    let labelText = label ? label : placeholder;
    labelText = labelText ? labelText : "Password input";

    // Show/hide pass
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.type = showPassword ? "text" : "password";
        }
    }, [showPassword]);

    // Change dots to ******
    useEffect(() => {
        setInnerValue(value as string);
    }, [value]);
    useEffect(() => {
        setDummy(Array(inputRef.current?.value.length).fill("*").join(""));
    }, [innerValue]);

    const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
        setInnerValue(evt.target.value);
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

            if (validate && Boolean(innerValue.length)) {
                inputRef.current.validationMessage.length
                ? inputRef.current.checkValidity()
                : setErrorMessage(undefined);
            }
        }
    }, [inputRef.current?.validity, error, validate, innerValue]);

    const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
        evt.preventDefault();
        setErrorMessage(inputRef.current?.validationMessage);
        setValidate(true);
        onInvalid && onInvalid(evt);
    };

    return (
        <div
            className={classNames("app-input", className, {
                "app-input--validate": validate,
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
                    pattern={pattern ? pattern : PATTERN_PASSWORD}
                    minLength={8}
                    value={innerValue}
                    {...other}
                    ref={inputRef}
                    onInvalid={invalidHandler}
                />

                {!showPassword && <span className="app-input__dummy">{dummy}</span>}

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
