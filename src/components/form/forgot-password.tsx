import React, { FormEvent, useEffect, useRef, useState } from "react";
import "./styles/form.scss";
import { Input } from "../../components/input";
import { Loader } from "../../components/loader";
import { Button } from "../../components/button/button";
import { CheckBox } from "../../components/checkbox";
import { network } from "../../services/networkService";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { RootState } from "../../store";
import Password from "../../components/app-input/password";
import { AppRoute } from "../../data/enum";

const ForgoPassword: React.FunctionComponent = (props) => {
    const user = useSelector<RootState>((state) => state.user.user.firstName);
    const localUserName = localStorage.getItem("savedUsername") || "";
    const [userName, setUserName] = useState<string>(localUserName);

    const [loginProcess, setLoginProcess] = useState<boolean>(false);

    const [forgotEmail, setForgotEmail] = useState<string>("");

    const [errors, setErrors] = useState<string | undefined>(undefined);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!!user) history.push("/research/my-files");
    }, [user]);

    const history = useHistory();
    const dispatch = useDispatch();

    // hide errors on any input
    useEffect(() => {
        errors && setErrors(undefined);
    }, [userName]);

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
                    setShowSuccessForgot(true);
                })
                .catch((e) => {
                    console.log(e);
                    setLoginProcess(false);
                });
        } else {
        }
    };


    return (
        <form 
                    className="login-page__container" 
                    onSubmit={sendPasswordResetRequest}
                    onReset={() => history.push(AppRoute.Login)}
                >
                    <div className="login-page__title">
                        <h2>Forgot Your Password?</h2>
                        <p>To restore the password, enter your email</p>
                    </div>
                    <div className="login-page__inputs">
                        <Input
                            onChangeInput={(value) => setForgotEmail(value)}
                            placeholder={"Enter the email"}
                            type={"text"}
                            value={forgotEmail}
                        />
                    </div>
                    <div className="login-page__btn">
                        <Button
                            type={"simple"}
                            text={"Send"}
                            disabled={!forgotEmail}
                            htmlType='submit'
                        />
                        <div
                            className="login-page__btn-cancel"
                        >
                            <Button type={"dotted"} text={"Cancel"} htmlType='reset' />
                        </div>
                    </div>
            {loginProcess && <Loader />}
        </form>
    );
};

export default ForgoPassword;
