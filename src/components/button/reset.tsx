import { ButtonHTMLAttributes, FunctionComponent } from "react";
import "./styles/reset.scss";
import { Link } from "react-router-dom";
import classNames from "classnames";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
	href?: string;
	mod?: string;
}

const Cancel: FunctionComponent<IButton> = ({
	type = "button",
	className,
	href,
	children,
	...other
}) => {
	const buttonClasses = classNames("reset", className);

	return href ? (
		<Link to={href} className={buttonClasses}>
			{children}
		</Link>
	) : (
		<button className={buttonClasses} type='reset' {...other}>
			{children}
		</button>
	);
};

export default Cancel;
