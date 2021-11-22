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

const URL_REGEXP = '(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})\r\n'


interface IInput extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    externalSetter?: (value: string) => void;
}

const InputURL: React.FunctionComponent<IInput> = ({
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
    maxLength,
    ...other
}) => {
    // const [innerValue, setInnerValue] = useState<string>(value as string);
    const inputRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    // check if any label is provided
    let labelText = label ? label : placeholder;
    labelText = labelText ? labelText : "Enter text";


    const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
        const { value } = evt.target;
        externalSetter && externalSetter(value);
        onChange && onChange(evt);
    };



    useEffect(() => {
        if (inputRef.current) {
            error && inputRef.current.setCustomValidity(error);

            if (value && Boolean(String(value).length)) {
                !inputRef.current.validationMessage.length && setErrorMessage(undefined)
            }

            setErrorMessage(inputRef.current.validationMessage)
        }
    }, [inputRef.current?.validity, error, value]);

    const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
        evt.preventDefault();
        setErrorMessage(inputRef.current?.validationMessage);
        onInvalid && onInvalid(evt);
    };


    return (
        <div
            className={classNames("app-input", className, {
                "app-input--validate": true,
            })}
        >
            <div className={
                classNames("app-input__wrapper", { "app-input__wrapper--limited": maxLength })}
                data-limit={`${(value as string)?.length} / ${maxLength}`}
            >
                <input
                    className="app-input__field"
                    onChange={changeHandler}
                    aria-invalid={!!errorMessage}
                    aria-label={labelText}
                    autoComplete={autoComplete}
                    placeholder={
                        `${placeholder ? placeholder : labelText}${required ? '*' : ''}`
                    }
                    required={required}
                    aria-required={required}
                    value={value || ""}
                    maxLength={maxLength}
                    type='url'
                    {...other}
                    ref={inputRef}
                    onInvalid={invalidHandler}
                />
            </div>

            {errorMessage && errorMessage.length && <p className="app-input__error">{errorMessage}</p>}
        </div>
    );
};

export default InputURL;
