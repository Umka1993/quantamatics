import { AppRoute, AuthorizationStatus } from '../data/enum';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { RouteProps } from 'react-router-dom';
import { RootState } from '../store';

interface IPrivateRoute extends RouteProps {
}

function PrivateRoute({
    children,
    ...props
}: IPrivateRoute): JSX.Element {
    const currentStatus = useSelector((state: RootState) => state.auth.status);
    return (
        <Route {...props}>
            {currentStatus === AuthorizationStatus.Auth ? (
                children
            ) : (
                <Redirect to={AppRoute.Login} />
            )}
        </Route>
    );
}

export default PrivateRoute;
