import React from "react";
import "./styles/input.scss"
import classNames from "classnames";


interface IInput {
    className?: string,
    placeholder?: string,
    onChangeInput: (value: string) => void
    value?: string
    required?: boolean
}

export const Input: React.FunctionComponent<IInput> = (props) => {
    const {className, placeholder, value, onChangeInput, required} = props;
    const inputClassNames = classNames('input', className)

    return(
        <div className={inputClassNames}>
            <input
                type="text"
                placeholder={placeholder ? required ? `${placeholder}*` : placeholder : ''}
                value={value || ''}
                onChange={(event) => onChangeInput(event.target.value)}
                required={required}
            />
        </div>
    )
}