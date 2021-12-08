import { AppRoute, AuthorizationStatus } from "../data/enum";
import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { RouteProps } from "react-router-dom";
import { RootState } from "../store";
import { getToken, dropToken } from "../services/token";
import { deleteAllCookies } from "../services/cookies";

interface IUnLoggedRoute extends RouteProps { }

const UnLoggedRoute: FunctionComponent<IUnLoggedRoute> = ({
    children,
    ...props
}) => {
    const currentStatus = useSelector((state: RootState) => state.auth.status);
    const token = getToken();

    if (Boolean(token)) {
        dropToken();

        localStorage.clear();
        sessionStorage.clear();

        deleteAllCookies();

        const currentPath = window.location.href;
        window.location.href = `${process.env.HUB_URL}hub/logout`;
        setTimeout(() => {
            window.location.href = currentPath;
        }, 800);
    }
    return (
        <Route {...props}>
            {currentStatus !== AuthorizationStatus.Auth ? (
                children
            ) : (
                <Redirect to={AppRoute.Home} />
            )}
        </Route>
    );
};

export default UnLoggedRoute;
