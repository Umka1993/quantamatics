import React from "react";
import "./styles/button.scss"
import {ReactSVGComponent} from "../input";
import SVG from "../SVG";
import classNames from 'classnames';

interface IButton {
    type: string,
    text: string,
    disabled?: boolean,
    onClick?: () => void,
    icon?: ReactSVGComponent,
    htmlType?: 'button' | 'reset' | 'submit'
}

export const Button: React.FunctionComponent<IButton> = ({type, disabled, onClick, htmlType='button', icon, text}) => {
    const buttonClasses: any = classNames({
        'old-button old-button--simple': type == 'simple',
        'old-button old-button--dotted': type == 'dotted',
        'old-button old-button--disabled': disabled,
    })
    return (
        <button className={buttonClasses} onClick={disabled ? () => {} : onClick} type={htmlType} disabled={disabled}>
            {icon && <SVG icon={icon} className='button__prepend'/>}
            {text}
        </button>
    )
}
