import React, { useState, useCallback } from "react";
import "./styles/input.scss"
import classNames from "classnames";
import SVG from '../SVG'
import eyeSVG from './assets/eye.svg'
import closedEyeSVG from './assets/closed-eye.svg'

export type ReactSVGComponent = React.FunctionComponent<React.SVGAttributes<SVGElement>>

const PASSWORD_REGEXP : RegExp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\[\]"\';:_\-<>\., =\+\/\\]).{8,}/

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
    icon?: ReactSVGComponent
}

export const Input: React.FunctionComponent<IInput> = (props) => {
    const { className, placeholder, value, onChangeInput, required, type, onEnterPress, icon, limit } = props;
    let { errors } = props;
    const [inputType, setInputType] = useState<string>(!!type ? type : 'text')

    const [errorMessage, setErrorMessage] = useState<string | boolean>(false)

    const minLength = type === 'password' ? 8 : 0;

    const inputClassNames = classNames(
        'input',
        className,
        { 'error': errors || errorMessage},
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

    const handleEnterPress = (event: any) => {
        if (type === 'password') {
            const passFormatMessage = 'The password must contain at least 8 characters, 1 uppercase letter, 1 digit and 1 special character.';
            const passwordCheck = PASSWORD_REGEXP.test(value as string);
            setErrorMessage(passwordCheck ? !passwordCheck : passFormatMessage);
        }
        if (!!onEnterPress && event.keyCode === 13) onEnterPress()
    }

    return (
        <div className={inputClassNames}>
            <input
                type={inputType}
                placeholder={placeholder ? required ? `${placeholder}*` : placeholder : ''}
                value={value || ''}
                onChange={(event) => onChangeInput(event.target.value)}
                required={required}
                onKeyUp={(event) => handleEnterPress(event)}
                maxLength={limit as number}
                minLength={minLength}
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
