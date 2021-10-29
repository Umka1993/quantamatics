import React, { FormEvent, useEffect, useRef, useState } from "react";
import "./styles/form.scss";
import { Input } from "../../components/input";
import { Loader } from "../../components/loader";
import Button, { ResetButton } from "../../components/app-button/";
import { network } from "../../services/networkService";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { RootState } from "../../store";
import { AppRoute } from "../../data/enum";

const ForgoPassword: React.FunctionComponent = (props) => {
    const user = useSelector<RootState>((state) => state.user.user.firstName);
    const localUserName = localStorage.getItem("savedUsername") || "";

    const [loginProcess, setLoginProcess] = useState<boolean>(false);

    const [forgotEmail, setForgotEmail] = useState<string>(localUserName);

    const [errors, setErrors] = useState<string | undefined>(undefined);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!!user) history.push("/research/my-files");
    }, [user]);

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        formRef.current?.reportValidity();
    }, [errors]);

    const sendPasswordResetRequest = (evt: any) => {
        evt.preventDefault();
        console.log(forgotEmail);
        if (forgotEmail) {
            setLoginProcess(true);
            network
                .post(
                    "api/Account/sendPasswordReset",
                    {},
                    { params: { email: forgotEmail } }
                )
                .then((r: any) => {
                    console.log(r);
                    setLoginProcess(false);
                    history.push("/success-restore-password");
                })
                .catch((e) => {
                    console.log(e);
                    setLoginProcess(false);
                });
        } else {
        }
    };

    return (
        <form className="form" onSubmit={sendPasswordResetRequest}>
            <header className="form__header">
                <h1 className="form__title">Forgot Your Password?</h1>
                <p className="form__subtitle">
                    To restore the password, enter your email
                </p>
            </header>

            <div className="login-page__inputs">
                <Input
                    onChangeInput={(value) => setForgotEmail(value)}
                    placeholder={"Enter the email"}
                    type={"text"}
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
            {loginProcess && <Loader />}
        </form>
    );
};

export default ForgoPassword;
