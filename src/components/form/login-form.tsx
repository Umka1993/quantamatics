import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../button";
import Input, { Password } from "../../components/app-input";
import Form from "./form";
import { AppRoute } from "../../data/enum";
import "./styles/form.scss";
import "./styles/login-page.scss";
import { useLoginUserMutation } from "../../api/account";
import IApiError from "../../types/api-error";
import useLogin from "../../hooks/useLogin";
import { InfoMessage } from "components/info-message/info-message";

const LoginForm: FunctionComponent = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<string | undefined>(undefined);
    const formRef = useRef<HTMLFormElement>(null);

    const [sendLogin, { isError, isSuccess, isLoading, error, data }] =
        useLoginUserMutation();

    const loginProcess = useLogin();

    const navigate = useNavigate();

    // hide errors on any input
    useEffect(() => {
        errors && setErrors(undefined);
    }, [email, password]);

    const handleLogin = () => {
        sendLogin({ email, password }).unwrap();
    };

    const handleResponseError = () => {
        if (isError) {
            const { status, data } = error as IApiError;
            if (status === 401) {
                switch (data) {
                    case "Failed sign in":
                        return navigate(AppRoute.NoRoles, {
                            state: {
                                headline: "Your user account is in the process of being set up",
                                image: "man",
                                subtitle:
                                    "Please try again later or start a chat session to get help live from someone on our team.",
                            } as InfoMessage,
                        });

                    case "User subscription has ended":
                        return navigate(AppRoute.Expired, {
                            state: {
                                headline: "Your user account is in the process of being set up",
                                image: "man",
                                subtitle:
                                    "Please try again later or start a chat session to get help live from someone on our team.",
                            } as InfoMessage,
                        });

                    case "User locked out":
                        setErrors(
                            "User account locked due to several failed login attempts. Please try again later."
                        );
                        break;
                    default:
                        setErrors("Incorrect email or password");
                }
            }
        }
    };
    useEffect(handleResponseError, [isError]);

    useEffect(() => {
        if (errors && formRef.current) {
            formRef.current.reportValidity();
        }
    }, [errors, formRef]);

    useEffect(() => {
        if (isSuccess && data) {
            loginProcess(data);
        }
    }, [isSuccess]);

    return (
        <Form
            onSubmit={handleLogin}
            headline="Sign In"
            subtitle="Enter your email and password"
            stopLoading={isLoading ? undefined : true}
            forwardRef={formRef}
        >
            <div className="login-page__inputs">
                <Input
                    externalSetter={setEmail}
                    placeholder="Email"
                    name="email"
                    required
                    value={email}
                    invalid={Boolean(errors)}
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
        </Form>
    );
};

export default LoginForm;
