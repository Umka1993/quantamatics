import React, { ButtonHTMLAttributes, FunctionComponent } from "react";
import "./styles/button.scss";
import SVG, { ReactSVGComponent } from "../SVG";
import { Link } from "react-router-dom";
import classNames from "classnames";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    mod?: string;
    // children: React.ReactNode
}

const Button: FunctionComponent<IButton> = ({
    type = "button",
    className,
    href,
    children,
    ...other
}) => {
    const buttonClasses = classNames("button", className);



    return href ? (
        <Link to={href} className={buttonClasses}>
            {children}
        </Link>
    ) : (
        <button className={buttonClasses} {...other}>
            {children}
        </button>
    );
};

export default Button;
