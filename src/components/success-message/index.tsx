import React, { FunctionComponent } from "react";
import Button from "../app-button";
import CheckIcon from "./assets/check.svg";
import './style/success.scss'

interface Props {
    title: string;
    linkText: string;
    path: string;
}

const SuccessMessage: FunctionComponent<Props> = ({
    title,
    linkText,
    path,
}) => {
    return (
        <article className="success">
            <h1 className="success__title">
                <CheckIcon aria-hidden="true" fill="currentColor" />
                {title}
            </h1>

            <Button href={path}>
                {linkText}
            </Button>
        </article>
    );
};

export default SuccessMessage;
