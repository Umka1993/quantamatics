import React from "react";
import { useHistory, useParams } from "react-router";
import { LoginForm, ResetPasswordForm, ForgotPasswordForm, SignUpForm } from "../../components/form/";

import "./style/full-width.scss";
import { AppRoute } from "../../data/enum";
import SuccessMessage from "../../components/success-message";
import ExpiredMessage from "../../components/info-message";

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
            child = <ForgotPasswordForm />;
            break;

        case AppRoute.ResetPassword:
            child = <ResetPasswordForm />;
            break;

        case AppRoute.SignUp:
            child = <SignUpForm />;
            break;

        case AppRoute.Expired:
            child = <ExpiredMessage />;
            break;
        default:
            break;
    }

    switch (success) {
        case "restore-password":
            child = (
                <SuccessMessage
                    title="A reset password email was sent to the email entered"
                    linkText="Go to Log in Page"
                    path={AppRoute.Login}
                />
            );
            break;
        case "invitation":
            child = (
                <SuccessMessage
                    title="An invitation email has been sent to the user"
                    linkText="Go Back"
                    go={-2}
                />
            );
            break;

        default:
            break;
    }

    return <main className="app__main app__main--full">{child}</main>;
};

export default FullWidthLayout;
