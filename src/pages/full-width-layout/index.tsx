import React from "react";
import { useHistory } from "react-router";
import LoginForm from "../../components/form/login-form";

import './style/full-width.scss'
import { AppRoute } from "../../data/enum";

const FullWidthLayout: React.FunctionComponent = (props) => {

    const { location : { pathname } } = useHistory()

    let child;

    switch (pathname) {
        case AppRoute.Login:
            child = (<LoginForm />)
            break;

        case AppRoute.Login:
            child = (<LoginForm />)
            break;

        
    
        default:
            return (
                <main className="app__main app__main--full">
                </main>
            );
            break;
    }


    return (
        <main className="app__main app__main--full">
            {child}
        </main>
    );
};

export default FullWidthLayout;