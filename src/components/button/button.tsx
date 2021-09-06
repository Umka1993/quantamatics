import React from "react";
import "./styles/button.scss"
const classNames = require('classnames');


interface IButton {
    type: string,
    text: string
}

export const Button: React.FunctionComponent<IButton> = (props) => {
    const buttonClasses: any = classNames({
        'button button__simple': props.type == 'simple',
        'button button__dotted': props.type == 'dotted'
    })
    return (
        <div className={buttonClasses}>
            {props.text}
        </div>
    )
}