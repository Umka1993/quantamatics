import React, { ButtonHTMLAttributes, FunctionComponent } from "react";
import "./styles/button.scss";
import { Link } from "react-router-dom";
import classNames from "classnames";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    mod?: string;
    variant?: 'valid' | 'danger';
}

const Button: FunctionComponent<IButton> = ({
	type = "button",
	className,
	href,
	children,
	variant,
	...other
}) => {
	const buttonClasses = classNames(className, "button", variant && `button--${variant}`);

	return href ? (
		<Link to={href} className={buttonClasses}>
			{children}
		</Link>
	) : (
		<button className={buttonClasses} type={type} {...other}>
			{children}
		</button>
	);
};

export default Button;
