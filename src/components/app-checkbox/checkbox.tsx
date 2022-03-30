import { FunctionComponent, HTMLProps, SVGProps } from "react";
import "./style/checkbox.scss";
import { ReactComponent as CheckIcon } from "./assets/check.svg";
import classNames from "classnames";

interface CheckboxProps extends SVGProps<SVGSVGElement> {
	highlightOnChecked?: boolean;
	checked?: boolean;
	disabled?: boolean;
}

const Checkbox: FunctionComponent<CheckboxProps> = ({
	highlightOnChecked,
	className,
	checked,
	disabled,
	...other
}) => {
	return (
		<CheckIcon
			width={16}
			height={16}
			className={classNames(
				"check-block__check",
				{ "check-block__check--highlight": highlightOnChecked },
				className
			)}
			role="checkbox"
			aria-checked={checked}
			tabIndex={0}
			aria-disabled={disabled}
			{...other}
		/>
	);
};

export default Checkbox;
