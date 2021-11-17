import { AppRoute, AuthorizationStatus } from '../data/enum';
import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { RouteProps } from 'react-router-dom';
import { RootState } from '../store';

interface IUnLoggedRoute extends RouteProps {
}


const UnLoggedRoute: FunctionComponent<IUnLoggedRoute> = ({ children, ...props }) => {
    const currentStatus = useSelector((state: RootState) => state.auth.status);
    return (<Route {...props}>
        {currentStatus !== AuthorizationStatus.Auth ? (
            children
        ) : (
            <Redirect to={AppRoute.Home} />
        )}
    </Route>)
}

export default UnLoggedRoute;
