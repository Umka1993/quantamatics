import React, {useState, useCallback} from "react";
import "./styles/input.scss"
import classNames from "classnames";
import SVG from '../SVG'
import eyeSVG from './assets/eye.svg'


interface IInput {
    className?: string,
    placeholder?: string,
    onChangeInput: (value: string) => void
    value?: string
    required?: boolean
    errors?: boolean
    type?: string
}

export const Input: React.FunctionComponent<IInput> = (props) => {
    const {className, placeholder, value, onChangeInput, required, errors, type} = props;
    const [inputType, setInputType] = useState<string>(!!type ? type : 'text')
    const [hiddenValue, setHiddenValue] = useState<string>('')
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

    return(
        <div className={inputClassNames}>
            <input
                type={inputType}
                placeholder={placeholder ? required ? `${placeholder}*` : placeholder : ''}
                value={value || ''}
                onChange={(event) => onChangeInput(event.target.value)}
                required={required}
            />
            {!!type && type === 'password' &&(
                <div className={classNames('show-password', {active: showPassword})}>
                    <SVG icon={eyeSVG} onClick={() => togglePasswordShow()}/>
                </div>
            )}
        </div>
    )
}