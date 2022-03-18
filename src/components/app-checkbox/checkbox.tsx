import React, { FunctionComponent, HTMLProps } from "react";
import "./style/checkbox.scss";
import CheckIcon from "./assets/check.svg";
import classNames from "classnames";

interface CheckboxProps extends Omit<HTMLProps<HTMLInputElement>, 'type'> {
	highlightOnChecked?: boolean;
}

const Checkbox: FunctionComponent<CheckboxProps> = ({ highlightOnChecked, checked, disabled, ...other }) => {
	return (
		<CheckIcon
			width={16}
			height={16}
			className={classNames("check-block__check", { 'check-block__check--highlight': highlightOnChecked })}
			role="checkbox"
			aria-checked={checked}
			tabIndex={0}
			aria-disabled={disabled}
			{...other}
		/>
	);
};

export default Checkbox;
