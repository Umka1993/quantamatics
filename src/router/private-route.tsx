import { AppRoute, AuthorizationStatus } from '../data/enum';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { RouteProps } from 'react-router-dom';
import { RootState } from '../store';

interface IPrivateRoute extends RouteProps {
    // status: string;
}

function PrivateRoute({
    children,
    // status,
    ...props
}: IPrivateRoute): JSX.Element {

    const currentStatus = useSelector((state: RootState) => state.auth.status);

    // if (currentStatus === AuthorizationStatus.Unknown) {

    //     const localUserName = localStorage.getItem("savedUsername");
    //     const localPassword = localStorage.getItem("savedPassword");

    //     if (localUserName && localPassword) {
    //         console.log('local', localUserName, localPassword)
    //     }
        
    // }

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
