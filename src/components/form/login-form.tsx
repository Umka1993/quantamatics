import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { RootState } from "../../store";

import Button from "../button";
import { CheckBox } from "../../components/checkbox";
import { Password, Email } from "../../components/app-input";
import Form from './form';

import { AppRoute, AuthorizationStatus } from "../../data/enum";

import "./styles/form.scss";
import "./styles/login-page.scss";
import { loginAction } from "../../store/authorization/actions";

const LoginForm: React.FunctionComponent = () => {
    const status = useSelector((state: RootState) => state.auth.status);

    const localUserName = localStorage.getItem("savedUsername") || "";
    const localPassword = localStorage.getItem("savedPassword") || "";

    const [email, setEmail] = useState<string>(localUserName);
    const [password, setPassword] = useState<string>(localPassword);

    const [finish, setFinish] = useState<boolean | undefined>(undefined);

    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const [errors, setErrors] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (status === AuthorizationStatus.Auth) history.push("/research/my-files");
    }, [status]);

    const history = useHistory();
    const dispatch = useDispatch();

    // hide errors on any input
    useEffect(() => {
        errors && setErrors(undefined);
    }, [email, password]);

    const onFinish = (user : any) => {
        setErrors(undefined);                
        if (rememberMe) {
            localStorage.setItem("savedUsername", email);
            localStorage.setItem("savedPassword", password);
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            sessionStorage.setItem("savedUsername", email);
            sessionStorage.setItem("savedPassword", password);
            sessionStorage.setItem("user", JSON.stringify(user));
        }
        
        setFinish(true);
        history.push(AppRoute.Home);
    }

    const onError = (status: number) => {
        if (status >= 400) {
            setErrors("Incorrect username or password");
        } else {
            setErrors("Something went wrong");
        }
        setFinish(true);
    }

    const handleLogin = (evt: FormEvent<HTMLFormElement>) => {
        dispatch(loginAction({ email, password, onFinish, onError }))
    };

    return (
        <Form
            onSubmit={handleLogin}
            headline='Sign in to your account'
            subtitle='Enter your email and password'
            stopLoading={finish}
        >
            <div className="login-page__inputs">
                <Email
                    externalSetter={setEmail}
                    placeholder='Email'
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
            <Button className="login-page__btn" disabled={!email || !password} type="submit">
                Sign In
            </Button>

        </Form>
    );
};

export default LoginForm;
