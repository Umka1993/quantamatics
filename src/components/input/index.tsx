import React, {useState, useCallback} from "react";
import "./styles/input.scss"
import classNames from "classnames";
import SVG from '../SVG'
import eyeSVG from './assets/eye.svg'
import closedEyeSVG from './assets/closed-eye.svg'

export type ReactSVGComponent = React.FunctionComponent<
    React.SVGAttributes<SVGElement>
    >

interface IInput {
    className?: string,
    placeholder?: string,
    onChangeInput: (value: string) => void
    onEnterPress?: () => void
    value?: string
    required?: boolean
    errors?: boolean
    type?: string
    icon?: ReactSVGComponent
}

export const Input: React.FunctionComponent<IInput> = (props) => {
    const {className, placeholder, value, onChangeInput, required, errors, type, onEnterPress, icon} = props;
    const [inputType, setInputType] = useState<string>(!!type ? type : 'text')
    const inputClassNames = classNames('input', className, {'error': errors}, {password: inputType === 'password'})
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const togglePasswordShow = useCallback(() => {
        if(showPassword) {
            setInputType('password')
            setShowPassword(false)
        }else {
            setInputType('text')
            setShowPassword(true)
        }
    }, [showPassword, inputType])

    const handleEnterPress = (event: any) => {
        if(!!onEnterPress && event.keyCode === 13) onEnterPress()
    }

    return(
        <div className={inputClassNames}>
            <input
                type={inputType}
                placeholder={placeholder ? required ? `${placeholder}*` : placeholder : ''}
                value={value || ''}
                onChange={(event) => onChangeInput(event.target.value)}
                required={required}
                onKeyUp={(event) => handleEnterPress(event)}
            />
            {!!type && type === 'password' &&(
                <div className={classNames('show-password', {active: showPassword})}>
                    {showPassword ? <SVG icon={closedEyeSVG} onClick={() => togglePasswordShow()}/> : <SVG icon={eyeSVG} onClick={() => togglePasswordShow()}/> }
                </div>

            )}
            {!! icon &&
                <div className="input__icon">
                    <SVG icon={icon}/>
                </div>
            }
        </div>
    )
}
