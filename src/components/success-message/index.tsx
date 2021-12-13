import React, { FunctionComponent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppRoute } from "../../data/enum";
import Button from "../button";
import CheckIcon from "./assets/check.svg";
import "./style/success.scss";

const SuccessMessage: FunctionComponent = () => {
    const { state } = useLocation();

    return state ? (
        <article className="success">
            <h1 className="success__title">
                <CheckIcon aria-hidden="true" fill="currentColor" />
                {state.headline}
            </h1>
            <Button href={state.link}>{state.linkText}</Button>
        </article>
    ) : (
        <Navigate to={AppRoute.Home} />
    );
};

export default SuccessMessage;
