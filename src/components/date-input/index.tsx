import React, {useState, useCallback} from "react";
import "./styles/input.scss"
import classNames from "classnames";
import calendarIcon from "./assets/calendar.svg"
import SVG from '../SVG'
import DatePicker from "react-datepicker";


interface IInput {
    className?: string,
    placeholder?: string,
    onChangeInput: (value: any) => void
    value?: any
    required?: boolean
    errors?: boolean
}

export const DateInput: React.FunctionComponent<IInput> = (props) => {
    const {className, placeholder, value, onChangeInput, required, errors} = props;
    const inputClassNames = classNames('date-input', className, {'error': errors})

    return(
        <div className={inputClassNames}>
            <DatePicker placeholderText={placeholder} selected={value} onChange={(date) => onChangeInput(date)} />
            <SVG icon={calendarIcon} />
        </div>
    )
}
