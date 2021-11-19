import React, { FormEvent, useEffect, useState } from "react";
import { Email } from "../../components/app-input/index";
import Button, { ResetButton } from "../button";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "../../store";
import { AppRoute } from "../../data/enum";
import { sendResetPasswordMail } from "../../store/reset-password/actions";
import Form from "./form";

import "./styles/form.scss";
import "./styles/login-page.scss";


const ForgotPassword: React.FunctionComponent = (props) => {
    const user = useSelector<RootState>((state) => state.auth.user?.firstName);
    const localUserName = localStorage.getItem("savedUsername") || "";

    const [finish, setFinish] = useState<boolean>(false);

    const [forgotEmail, setForgotEmail] = useState<string>(localUserName);

    useEffect(() => {
        if (!!user) history.push("/research/my-files");
    }, [user]);
    const history = useHistory();

    const dispatch = useDispatch();

    const onError = () => { setFinish(true); }
    const onFinish = () => { history.push("/success-restore-password"); }

    const sendPasswordResetRequest = (evt: FormEvent<HTMLFormElement>) => {
        dispatch(sendResetPasswordMail(forgotEmail, onFinish, onError))
    };

    return (
        <Form
            headline="Forgot Your Password?"
            subtitle="To restore the password, enter your email"
            onSubmit={sendPasswordResetRequest}
            stopLoading={finish}
            className='login-form'
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
