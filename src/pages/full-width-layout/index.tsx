import React from "react";
import { useHistory, useParams } from "react-router";
import LoginForm from "../../components/form/login-form";
import ForgotPassword from "../../components/form/forgot-password";
import ResetPassword from "../../components/form/reset-password";

import "./style/full-width.scss";
import { AppRoute } from "../../data/enum";
import SuccessMessage from "../../components/success-message";

type Param = { success: string };

const FullWidthLayout: React.FunctionComponent = (props) => {
    const {
        location: { pathname },
    } = useHistory();
    const { success } = useParams<Param>();

    let child;

    switch (pathname) {
        case AppRoute.Login:
            child = <LoginForm />;
            break;

        case AppRoute.ForgotPassword:
            child = <ForgotPassword />;
            break;

        case AppRoute.ResetPassword:
            child = <ResetPassword />;
            break;

        default:
            break;
    }

    switch (success) {
        case "-restore-password":
            child = (
                <SuccessMessage
                    title="A reset password email was sent to the email entered"
                    linkText="Go to Log in Page"
                    path={AppRoute.Login}
                />
            );
            break;

        default:
            break;
    }

    return <main className="app__main app__main--full">{child}</main>;
};

export default FullWidthLayout;
