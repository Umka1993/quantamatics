import { ButtonHTMLAttributes, CSSProperties, FunctionComponent } from "react";
import s from "./styles/button.module.scss";
import { Link } from "react-router-dom";
import classNames from "classnames";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
	href?: string;
	variant?: 'bordered' | "valid" | "danger" | "transparent-light";
	padding?: string;
	fontSize?: string;
	fontWeight?: number;
}

const Button: FunctionComponent<IButton> = ({
	type = "button",
	className,
	href,
	children,
	padding = "11px",
	fontSize = '1rem',
	fontWeight = 600,
	variant = 'bordered',
	style,
	disabled,
	...other
}) => {
	const preparedAttributes = {
		className: classNames(s.basic, !disabled && s[variant], className),
		style: { ...style, padding, fontSize, fontWeight } as CSSProperties,
	};

	if (!disabled && href) {
		return href.startsWith("http") ? (
			<a
				{...preparedAttributes}
				href={href}
				target="_blank"
				rel="noopener noreferrer"
			>
				{children}
			</a>
		) : (
			<Link to={href} {...preparedAttributes}>
				{children}
			</Link>
		);
	}

	return (
		<button {...preparedAttributes} type={type} disabled={disabled} {...other} >
			{children}
		</button>
	);
};

export default Button;
