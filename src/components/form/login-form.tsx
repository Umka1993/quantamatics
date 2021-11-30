import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";

import Button from "../button";
import { CheckBox } from "../../components/checkbox";
import { Password, Email } from "../../components/app-input";
import Form from "./form";

import { AppRoute } from "../../data/enum";

import "./styles/form.scss";
import "./styles/login-page.scss";
import { useLoginUserMutation } from "../../api/account";
import IApiError from "../../types/api-error";
import { login } from "../../store/authorization";
import { saveToken } from "../../services/token";
import pendoInitialize from "../../services/pendoInitialize";

const LoginForm: React.FunctionComponent = () => {
    const localUserName = localStorage.getItem("savedUsername") || "";
    const localPassword = localStorage.getItem("savedPassword") || "";

    const [email, setEmail] = useState<string>(localUserName);
    const [password, setPassword] = useState<string>(localPassword);

    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const [errors, setErrors] = useState<string | undefined>(undefined);

    const history = useHistory();
    const dispatch = useDispatch();
    const [sendLogin, { isError, isSuccess, isLoading, error, data }] =
        useLoginUserMutation();

    // hide errors on any input
    useEffect(() => {
        errors && setErrors(undefined);
    }, [email, password]);

    const handleLogin = (evt: FormEvent<HTMLFormElement>) => {
        sendLogin({ email, password }).unwrap;
    };

    useEffect(() => {
        if (isError) {
            const text =
                (error as IApiError).status >= 400
                    ? "Incorrect username or password"
                    : "Something went wrong";

            setErrors(text);
        }
    }, [isError]);

    useEffect(() => {
        if (isSuccess && data) {
            setErrors(undefined);
            pendoInitialize(data.user);
            if (new Date(data.user.subscriptionEndDate) > new Date()) {
                dispatch(login(data.user));
                saveToken(data.token);
                if (rememberMe) {
                    localStorage.setItem("savedUsername", email);
                    localStorage.setItem("savedPassword", password);
                    localStorage.setItem("user", JSON.stringify(data.user));
                } else {
                    sessionStorage.setItem("savedUsername", email);
                    sessionStorage.setItem("savedPassword", password);
                    sessionStorage.setItem("user", JSON.stringify(data.user));
                }
                history.push(AppRoute.Home);
            } else {
                history.push(AppRoute.Expired);
            }
        }
    }, [isSuccess]);

    return (
        <Form
            onSubmit={handleLogin}
            headline="Sign In"
            subtitle="Enter your email and password"
            stopLoading={isLoading ? undefined : true}
        >
            <div className="login-page__inputs">
                <Email
                    externalSetter={setEmail}
                    placeholder="Email"
                    name="email"
                    value={email}
                    error={errors}
                    hideError={true}
                />

                <Password
                    placeholder="Password"
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
                    externalSetter={setRememberMe}
                    label={"Remember Me"}
                />
                <Link to={AppRoute.ForgotPassword} className="login-page__forgot">
                    Forgot Password?
                </Link>
            </div>
            <Button
                className="login-page__btn"
                disabled={!email || !password}
                type="submit"
            >
                Sign In
            </Button>
            <p className="login-page__note">
                Interested in Quantamatics and want to{" "}
                <a
                    href="https://www.facteus.com/technology/quantamatics/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    learn more?
                </a>
            </p>

            <iframe src="https://hub-k8s.dev.quantamatics.net/hub/logout" className='sr-only' />
        </Form>
    );
};

export default LoginForm;
