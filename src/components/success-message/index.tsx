import React, { FunctionComponent } from "react";
import { useHistory } from "react-router";
import Button from "../app-button";
import CheckIcon from "./assets/check.svg";
import './style/success.scss'

interface Props {
    title: string;
    linkText: string;
    path?: string;
    go?: number;
}

const SuccessMessage: FunctionComponent<Props> = ({
    title,
    linkText,
    path,
    go
}) => {
    const history = useHistory();

    return (
        <article className="success">
            <h1 className="success__title">
                <CheckIcon aria-hidden="true" fill="currentColor" />
                {title}
            </h1>

            <Button href={path} onClick={go ? () => history.go(go) : undefined }>
                {linkText}
            </Button>
        </article>
    );
};

export default SuccessMessage;
