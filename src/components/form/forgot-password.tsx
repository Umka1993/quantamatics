import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Email } from "../../components/app-input/index";
import Button, { ResetButton } from "../../components/app-button/";
import { network } from "../../services/networkService";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "../../store";
import { AppRoute } from "../../data/enum";
import Form from "./form";

import "./styles/form.scss";
import "./styles/login-page.scss";

const ForgotPassword: React.FunctionComponent = (props) => {
    const user = useSelector<RootState>((state) => state.auth.user?.firstName);
    const localUserName = localStorage.getItem("savedUsername") || "";

    const [finish, setFinish] = useState<boolean>(false);

    const [forgotEmail, setForgotEmail] = useState<string>(localUserName);

    // const [errors, setErrors] = useState<string | undefined>(undefined);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!!user) history.push("/research/my-files");
    }, [user]);

    const history = useHistory();

    const sendPasswordResetRequest = (evt: any) => {
        network
            .post(
                "api/Account/sendPasswordReset",
                {},
                { params: { email: forgotEmail } }
            )
            .then((r: any) => {
                console.log(r);
                setFinish(true);
                history.push("/success-restore-password");
            })
            .catch((e) => {
                console.log(e);
                setFinish(true);
            });
    };

    return (
        <Form
            title="Forgot Your Password?"
            subtitle="To restore the password, enter your email"
            onSubmit={sendPasswordResetRequest}
            stopLoading={finish}
        >
            <div className="login-page__inputs">
                <Email
                    externalSetter={setForgotEmail}
                    value={forgotEmail}
                    name="email"
                    placeholder={"Enter the email"}
                />
            </div>

            <Button className="login-page__btn" type="submit" disabled={!forgotEmail}>
                Send
            </Button>

            <ResetButton className="login-page__btn-cancel" href={AppRoute.Login}>
                Cancel
            </ResetButton>
        </Form>
    );
};

export default ForgotPassword;
