import React from "react";
import "./styles/input.scss"
import classNames from "classnames";


interface IInput {
    className?: string,
    placeholder?: string,
    onChangeInput: (value: string) => void
    value?: string
    required?: boolean
    errors?: boolean
}

export const Input: React.FunctionComponent<IInput> = (props) => {
    const {className, placeholder, value, onChangeInput, required, errors} = props;
    const inputClassNames = classNames('input', className, {'error': errors})

    return(
        <div className={inputClassNames}>
            <input
                type="text"
                placeholder={placeholder ? required ? `${placeholder}*` : placeholder : ''}
                value={value || ''}
                onChange={(event) => onChangeInput(event.target.value)}
                required={required}
            />
            {errors && (<div className='error-container'>Is Required*</div>)}
        </div>
    )
}