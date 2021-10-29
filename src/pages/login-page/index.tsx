import React, { FormEvent, useEffect, useRef, useState } from "react";
import "./styles/login-page.scss";
import { Input } from "../../components/input";
import { Loader } from "../../components/loader";
import { Button } from "../../components/button/button";
import { CheckBox } from "../../components/checkbox";
import { network } from "../../services/networkService";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "../../store";
import SVG from "../../components/SVG";
import successIcon from "../add-user-page/assets/sucess-icon.svg";
import Password from "../../components/app-input/password";

export const SignInPage: React.FunctionComponent = (props) => {
    const user = useSelector<RootState>((state) => state.user.user.firstName);
    const localUserName = localStorage.getItem("savedUsername") || "";
    const localPassword = localStorage.getItem("savedPassword") || "";

    const [userName, setUserName] = useState<string>(localUserName);
    const [password, setPassword] = useState<string>(localPassword);
    const [forgotEmail, setForgotEmail] = useState<string>("");

    const [loginProcess, setLoginProcess] = useState<boolean>(false);

    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
    const [showSuccessForgot, setShowSuccessForgot] = useState<boolean>(false);

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
    }, [userName, password]);

    useEffect(() => {
        formRef.current?.reportValidity();
    }, [errors]);

    const handleLogin = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        setLoginProcess(true);
        network
            .post("api/Account/login", {
                email: userName,
                password: password,
            })
            .then((r: any) => {
                console.log(r);
                dispatch({
                    type: "LOGIN",
                    payload: {
                        id: r.data.user.id,
                        email: r.data.user.email,
                        firstName: r.data.user.firstName,
                        lastName: r.data.user.lastName,
                        companyName: r.data.user.companyName,
                        companyRole: r.data.user.companyRole,
                        location: r.data.user.location,
                        subscriptionType: r.data.user.subscriptionType,
                        subscriptionEndDate: r.data.user.subscriptionEndDate,
                        reportPanel: null,
                        expirationDate: r.data.user.expirationDate,
                        avatar: "",
                    },
                });
                setErrors(undefined);
                localStorage.setItem("id_token", r.data.token);
                localStorage.setItem("user", JSON.stringify(r.data.user));
                if (rememberMe) {
                    localStorage.setItem("savedUsername", userName);
                    localStorage.setItem("savedPassword", password);
                }

                setLoginProcess(false);
                history.push("/");
                history.push("/apps/organizations/list");
            })
            .catch((e) => {
                if (e.response.status >= 400) {
                    setErrors("Incorrect username or password");
                } else {
                    setErrors("Something went wrong");
                }
                setLoginProcess(false);
            });
    };

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

    if (!!user) return <div />;

    return (
        <div className="login-page app__main">
            {!showForgotPassword && !showSuccessForgot && (
                <form
                    className="login-page__container"
                    onSubmit={handleLogin}
                    ref={formRef}
                >
                    <div className="login-page__title">
                        <h2>Sign in to your account</h2>
                        <p>Enter your email and password</p>
                    </div>
                    <div className="login-page__inputs">
                        <Input
                            onChangeInput={(value) => setUserName(value)}
                            placeholder={"Enter the username"}
                            type={"text"}
                            value={userName}
                            errors={!!errors}
                            name="email"
                        />

                        <Password
                            placeholder={"Enter the password"}
                            value={password}
                            externalSetter={setPassword}
                            name="password"
                            autoComplete="current-password"
                            error={errors}
                        />
                    </div>
                    <div className="login-page__wrap">
                        <CheckBox
                            checked={rememberMe}
                            onClick={(value) => setRememberMe(value)}
                            label={"Remember Me"}
                        />
                        <div
                            className="login-page__forgot"
                            onClick={() => setShowForgotPassword(true)}
                        >
                            Forgot Password?
                        </div>
                    </div>
                    <div className="login-page__btn">
                        <Button
                            type={"simple"}
                            text={"Sign In"}
                            disabled={!userName || !password}
                            htmlType="submit"
                        />
                    </div>
                </form>
            )}
            {showForgotPassword && !showSuccessForgot && (
                <form 
                    className="login-page__container" 
                    onSubmit={sendPasswordResetRequest}
                    onReset={() => setShowForgotPassword(false)}
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
                </form>
            )}

            {showSuccessForgot && (
                <div className="login-page__forgot-password success">
                    <div className="login-page__container">
                        <div className="login-page__forgot-password-success-text">
                            <SVG icon={successIcon} />A reset password email was sent to the
                            email entered
                        </div>
                        <div className="login-page__btn">
                            <Button
                                onClick={() => {
                                    setShowSuccessForgot(false);
                                    setShowForgotPassword(false);
                                }}
                                type={"simple"}
                                text={"Go to Log in Page"}
                            />
                        </div>
                    </div>
                </div>
            )}
            {loginProcess && <Loader />}
        </div>
    );
};
