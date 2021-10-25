import React from "react";
import "./styles/checkbox.scss"

interface ICheckBox {
    label?: string
    onClick: (value: boolean) => void
    checked: boolean
}

export const CheckBox: React.FunctionComponent<ICheckBox> = (props) => {
    return (
        <div>
            <label className="b-contain">
                <span>{props.label}</span>
                <input type="checkbox"defaultChecked={props.checked}/>
                <div className="b-input" />
            </label>
        </div>
    )
}
