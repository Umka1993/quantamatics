import { AppRoute, AuthorizationStatus } from '../data/enum';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { RouteProps } from 'react-router-dom';
import { RootState } from '../store';
import { getCookie } from '../services/cookies';
import useLogout from '../hooks/useLogout';

function PrivateRoute({
    children,
    ...props
}: RouteProps): JSX.Element {

    const logout = useLogout();
    useEffect(() => {
        !getCookie('user') && logout();
    }, [document.cookie])
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
