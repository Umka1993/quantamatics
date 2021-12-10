import { AppRoute, AuthorizationStatus } from "../data/enum";
import React, { FunctionComponent, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { RouteProps } from "react-router-dom";
import { RootState } from "../store";
import { getCookie } from "../services/cookies";
import { logoutFromJupiter } from "../services/logoutFromJupiter";

const UnLoggedRoute: FunctionComponent<RouteProps> = ({
    children,
    ...props
}) => {
    const currentStatus = useSelector((state: RootState) => state.auth.status);
    useEffect(() => {
        getCookie('user') && logoutFromJupiter();
    }, [document.cookie])

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
