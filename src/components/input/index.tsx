import React, { useState, useCallback, KeyboardEventHandler, useEffect, useRef } from "react";
import "./styles/input.scss"
import classNames from "classnames";
import SVG from '../SVG'
import eyeSVG from './assets/eye.svg'
import closedEyeSVG from './assets/closed-eye.svg'
import useDebounce from "../../services/useDebounce";

export type ReactSVGComponent = React.FunctionComponent<React.SVGAttributes<SVGElement>>

const PATTERN_PASSWORD = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\\[\\]\\\\\"';:<_>., =+/-]).*$"

interface IInput {
    className?: string,
    placeholder?: string,
    onChangeInput: (value: string) => void
    onEnterPress?: () => void
    value?: string
    required?: boolean
    errors?: boolean
    type?: string
    limit?: string | number
    icon?: ReactSVGComponent,
    enableValidation?: boolean;
    name?: string;
    errorText?: string;
    onInvalid?: any;
}

export const Input: React.FunctionComponent<IInput> = (props) => {
    const { className, placeholder, value, onChangeInput, required, type, onEnterPress, icon, limit, enableValidation, name = '', errorText, onInvalid } = props;
    let { errors } = props;
    const [inputType, setInputType] = useState<string>(!!type ? type : 'text')

    const inputRef = useRef<HTMLInputElement>(null);

    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    const validatingPass = type === 'password' && enableValidation;

    const pattern = validatingPass ? PATTERN_PASSWORD : undefined;

    const minLength = validatingPass ? 8 : 0;

    const inputClassNames = classNames(
        'input',
        className,
        { 'error': errors || errorMessage },
        { password: inputType === 'password' },
        { 'input--limited': limit }
    )
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const togglePasswordShow = useCallback(() => {
        if (showPassword) {
            setInputType('password')
            setShowPassword(false)
        } else {
            setInputType('text')
            setShowPassword(true)
        }
    }, [showPassword, inputType])
    
    useEffect(() => {
        setErrorMessage(errorText);
        errorText && onInvalid && onInvalid();
    }, [errorText]) 

    useEffect(() => {
        enableValidation && validatePassword();
    }, [enableValidation]) 

    const validatePassword = () => {
        if (inputRef.current) {
            const { tooShort, patternMismatch } = inputRef.current.validity

            if (tooShort || patternMismatch) {

                const textStart = 'The password must contain at least ';
                let requirements = [];
    
                tooShort && requirements.push('8 characters');
                patternMismatch && requirements.push('1 uppercase letter, 1 digit and 1 special character.');
    
                const result = `${textStart} ${requirements.join(', ')}`
    
                setErrorMessage(result);
                onInvalid && onInvalid();
    
            } else {
                setErrorMessage(undefined);
            }
        }

    }


    const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (evt) => {
        enableValidation && validatePassword();
        if (!!onEnterPress && evt.key === 'Enter') onEnterPress()
    }

    return (
        <div className={inputClassNames}>
            <input
                type={inputType}
                placeholder={placeholder ? required ? `${placeholder}*` : placeholder : ''}
                value={value || ''}
                onChange={(event) => onChangeInput(event.target.value)}
                required={required}
                onKeyUp={handleKeyUp}
                maxLength={limit as number}
                minLength={minLength}
                pattern={pattern}
                name={name}
                ref={inputRef}
            />
            {errorMessage && <p className='input__error'>{errorMessage}</p>}
            {!!type && type === 'password' && (
                <div className={classNames('show-password', { active: showPassword })}>
                    {showPassword ? <SVG icon={eyeSVG} onClick={() => togglePasswordShow()} /> :
                        <SVG icon={closedEyeSVG} onClick={() => togglePasswordShow()} />}
                </div>

            )}
            {!!icon &&
                <div className="input__icon">
                    <SVG icon={icon} />
                </div>
            }
            {
                !!limit &&
                <div className="input__limit">
                    {value?.length} / {limit}
                </div>
            }
        </div>
    )
}
