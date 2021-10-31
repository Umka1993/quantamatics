import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "../../components/input";
import { Loader } from "../../components/loader";
import Button, { ResetButton } from "../../components/app-button/";
import { network } from "../../services/networkService";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "../../store";
import { AppRoute } from "../../data/enum";
import Form from './form';


import "./styles/form.scss";
import "./styles/login-page.scss";

const ForgoPassword: React.FunctionComponent = (props) => {
    const user = useSelector<RootState>((state) => state.user.user.firstName);
    const localUserName = localStorage.getItem("savedUsername") || "";

    const [finish, setFinish] = useState<boolean>(false);

    const [forgotEmail, setForgotEmail] = useState<string>(localUserName);

    // const [errors, setErrors] = useState<string | undefined>(undefined);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!!user) history.push("/research/my-files");
    }, [user]);

    const history = useHistory();

    // useEffect(() => {
    //     formRef.current?.reportValidity();
    // }, [errors]);

    const sendPasswordResetRequest = (evt: any) => {
        if (forgotEmail) {
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
        } else {
        }
    };

    return (
        <Form 
            title='Forgot Your Password?' 
            subtitle='To restore the password, enter your email' 
            onSubmit={sendPasswordResetRequest}
            stopLoading={finish}
        >
            <div className="login-page__inputs">
                <Input
                    onChangeInput={(value) => setForgotEmail(value)}
                    placeholder={"Enter the email"}
                    type='email'
                    value={forgotEmail}
                />
            </div>
            <div className="login-page__btn">
                <Button type="submit" disabled={!forgotEmail}>
                    Send
                </Button>
                <div className="login-page__btn-cancel">
                    <ResetButton href={AppRoute.Login}>Cancel</ResetButton>
                </div>
            </div>
        </Form>
    );
};

export default ForgoPassword;
