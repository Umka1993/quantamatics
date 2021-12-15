import React, { FunctionComponent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppRoute } from "../../data/enum";
import Button from "../button";
import CheckIcon from "./assets/check.svg";
import style from "./style/success.module.scss";

const SuccessMessage: FunctionComponent = () => {
    const { state } = useLocation();

    return state ? (
        <article className={style.success}>
            <h1 className={style.title}>
                <CheckIcon aria-hidden="true" fill="currentColor" />
                {state.headline}
            </h1>
            <Button className={style.button} href={state.link}>{state.linkText}</Button>
        </article>
    ) : (
        <Navigate to={AppRoute.Home} />
    );
};

export default SuccessMessage;
