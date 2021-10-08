import React from "react";
import "./styles/button.scss"
import {ReactSVGComponent} from "../input";
import SVG from "../SVG";
const classNames = require('classnames');


interface IButton {
    type: string,
    text: string
    disabled?: boolean
    onClick?: () => void
    icon?: ReactSVGComponent
}

export const Button: React.FunctionComponent<IButton> = (props) => {
    const buttonClasses: any = classNames({
        'button button__simple': props.type == 'simple',
        'button button__dotted': props.type == 'dotted',
        'button button__disabled': props.disabled,
    })
    return (
        <div className={buttonClasses} onClick={props.disabled ? () => {} : props.onClick}>
            {props.icon && <SVG icon={props.icon}/>}
            {props.text}
        </div>
    )
}
