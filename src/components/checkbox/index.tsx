import React from "react";
import "./styles/checkbox.scss"

interface ICheckBox {
	label?: string
	checked: boolean
	externalSetter?: any;
}

export const CheckBox: React.FunctionComponent<ICheckBox> = (props) => {
	const inputHandler = (evt :any) => {
		props.externalSetter(evt.target.checked)
	}
	return (
		<div>
			<label className="b-contain">
				<span>{props.label}</span>
				<input type="checkbox" defaultChecked={props.checked} onInput={inputHandler}/>
				<div className="b-input" />
			</label>
		</div>
	)
}
