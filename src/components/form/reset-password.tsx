import React, { useCallback, useEffect, useState } from "react";
import { Password } from "../../components/app-input/index";
import Button from "../button";
import { useHistory } from "react-router-dom";
import { AppRoute } from "../../data/enum";
import Form from "./form";

import "./styles/form.scss";
import "./styles/login-page.scss";
import { useVerifyTokenQuery, useResetPasswordMutation } from "../../api/account";
import Loader from "../loader";

const ResetPassword: React.FunctionComponent = () => {
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [compare, setCompare] = useState<string | undefined>(undefined);

    const [finish, setFinish] = useState<boolean>(false);
    const history = useHistory();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    const [sendPassword, { isSuccess: isPasswordUpdated, isError: isPasswordError }] = useResetPasswordMutation();

    const { isSuccess: isTokenValid, isError: isExpiredToken } = useVerifyTokenQuery({ userName: String(email), token: token as string });

    useEffect(() => {
        isExpiredToken && history.push(AppRoute.ExpiredPassword)
    }, [isExpiredToken])

    const handleResetPassword = useCallback(() => {
        sendPassword({ email: (email as string), password, token: (token as string) }).unwrap()
    }, [password, passwordConfirm]);

    useEffect(() => {
        setCompare(password !== passwordConfirm ? "The passwords do not match" : undefined);
    }, [password, passwordConfirm])

    useEffect(() => {
        isPasswordUpdated && history.push(AppRoute.Login);
    }, [isPasswordUpdated])

    useEffect(() => {
        isPasswordError && setFinish(true);
    }, [isPasswordError])

    if (isTokenValid) {
        return (
            <Form
                headline="Reset Password"
                subtitle="Set a new password to sign in to Quantamatics"
                onSubmit={handleResetPassword}
                stopLoading={finish ? finish : undefined}
            >
                <div className="login-page__inputs">
                    <Password
                        autoComplete="new-password"
                        value={password}
                        externalSetter={setPassword}
                        placeholder="New Password"
                        error={compare}
                        hideError
                    />
                    <Password
                        autoComplete="new-password"
                        value={passwordConfirm}
                        externalSetter={setPasswordConfirm}
                        placeholder="Confirm New Password"
                        error={compare}
                    />
                </div>

                <Button className="login-page__btn" type="submit" disabled={!password || !passwordConfirm}>
                    Save
                </Button>
            </Form>
        );
    } else {
        return (<Loader />)
    }
};

export default ResetPassword;
