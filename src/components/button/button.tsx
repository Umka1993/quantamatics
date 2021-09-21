import React from "react";
import "./styles/button.scss"
const classNames = require('classnames');


interface IButton {
    type: string,
    text: string
    disabled?: boolean
    onClick?: () => void
}

export const Button: React.FunctionComponent<IButton> = (props) => {
    const buttonClasses: any = classNames({
        'button button__simple': props.type == 'simple',
        'button button__dotted': props.type == 'dotted',
        'button button__disabled': props.disabled,
    })
    return (
        <div className={buttonClasses} onClick={props.disabled ? () => {} : props.onClick}>
            {props.text}
        </div>
    )
}