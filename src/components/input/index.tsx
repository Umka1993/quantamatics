import React, {
    useState,
    KeyboardEventHandler,
    useEffect,
    useRef,
} from "react";
import "./styles/input.scss";
import classNames from "classnames";
import SVG from "../SVG";

export type ReactSVGComponent = React.FunctionComponent<
    React.SVGAttributes<SVGElement>
>;

interface IInput {
    className?: string;
    placeholder?: string;
    onChangeInput: (value: string) => void;
    onEnterPress?: () => void;
    value?: string;
    required?: boolean;
    errors?: boolean;
    type?: string;
    limit?: string | number;
    icon?: ReactSVGComponent;
    enableValidation?: boolean;
    name?: string;
    errorText?: string;
    onInvalid?: any;
}

export const Input: React.FunctionComponent<IInput> = ({
    className,
    placeholder,
    value,
    onChangeInput,
    required,
    type,
    onEnterPress,
    icon,
    limit,
    name = "",
    errorText,
    onInvalid,
    ...props
}) => {
    let { errors } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const inputClassNames = classNames(
        "input",
        className,
        { error: errors || errorMessage },
        { "input--limited": limit }
    );

    useEffect(() => {
        setErrorMessage(errorText);
        errorText && onInvalid && onInvalid();
    }, [errorText]);

    const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (evt) => {
        if (!!onEnterPress && evt.key === "Enter") onEnterPress();
    };

    return (
        <div className={inputClassNames}>
            <input
                type={type}
                placeholder={
                    placeholder ? (required ? `${placeholder}*` : placeholder) : ""
                }
                value={value || ""}
                onChange={(event) => onChangeInput(event.target.value)}
                required={required}
                onKeyUp={handleKeyUp}
                maxLength={limit as number}
                name={name}
                ref={inputRef}
            />
            {errorMessage && <p className="input__error">{errorMessage}</p>}

            {!!icon && (
                <div className="input__icon">
                    <SVG icon={icon} />
                </div>
            )}
            {!!limit && (
                <div className="input__limit">
                    {value?.length} / {limit}
                </div>
            )}
        </div>
    );
};
