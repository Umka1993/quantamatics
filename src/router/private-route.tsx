import { AppRoute, AuthorizationStatus } from '../data/enum';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { RouteProps } from 'react-router-dom';
import { RootState } from '../store';
import { getCookie } from '../services/cookies';
import { logout } from '../store/authorization';

interface IPrivateRoute extends RouteProps {
}

function PrivateRoute({
    children,
    ...props
}: IPrivateRoute): JSX.Element {

    const dispatch = useDispatch();
    useEffect(() => {

        if (!getCookie('user')) {
            dispatch(logout())
        }

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
