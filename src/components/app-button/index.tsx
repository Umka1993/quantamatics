import React, { ButtonHTMLAttributes, FunctionComponent } from "react";
import "./styles/button.scss";
import SVG, { ReactSVGComponent } from "../SVG";
import { Link } from "react-router-dom";

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
    const buttonClasses = ["button", className].join(" ");



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
