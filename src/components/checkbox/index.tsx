import React from "react";
import "./styles/checkbox.scss"

interface ICheckBox {
    label?: string
}

export const CheckBox: React.FunctionComponent<ICheckBox> = (props) => {
    return (
        <div>
            <label className="b-contain">
                <span>{props.label}</span>
                <input type="checkbox"/>
                <div className="b-input"></div>
            </label>
        </div>
    )
}
