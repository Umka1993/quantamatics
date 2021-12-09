import React, { useEffect, useState, FunctionComponent } from "react";
import { Link } from "react-router-dom";
import Button from "../button";
import { CheckBox } from "../../components/checkbox";
import { Password, Email } from "../../components/app-input";
import Form from "./form";
import { AppRoute } from "../../data/enum";
import "./styles/form.scss";
import "./styles/login-page.scss";
import { useLoginUserMutation } from "../../api/account";
import IApiError from "../../types/api-error";
import useLogin from "../../hooks/useLogin";

const LoginForm: FunctionComponent = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [errors, setErrors] = useState<string | undefined>(undefined);

    const [sendLogin, { isError, isSuccess, isLoading, error, data }] =
        useLoginUserMutation();

    const loginProcess = useLogin();

    // hide errors on any input
    useEffect(() => {
        errors && setErrors(undefined);
    }, [email, password]);

    const handleLogin = () => {
        sendLogin({ email, password }).unwrap();
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
            loginProcess(data, rememberMe)
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
                    href="https://www.facteus.com/quantamatics"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    learn more?
                </a>
            </p>

            {/* Logout from Jupiter For Firefox  */}

            <iframe 
                src="https://hub-k8s.dev.quantamatics.net/hub/logout" 
                className='sr-only' aria-hidden={true} 
            />
        </Form>
    );
};

export default LoginForm;
