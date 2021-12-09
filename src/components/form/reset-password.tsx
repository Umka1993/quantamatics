import React, { useCallback, useEffect, useState } from "react";
import { Password } from "../../components/app-input/index";
import Button from "../button";
import { useDispatch } from "react-redux";
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
    const dispatch = useDispatch();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    const [sendPassword, { isSuccess: isPasswordUpdated, isError: isPasswordError }] = useResetPasswordMutation();

    const { isSuccess: isTokenValid, isError: isExpiredToken } = useVerifyTokenQuery({ userName: String(email), token: token as string });

    useEffect(() => {
        isExpiredToken && history.push(AppRoute.ExpiredPassword)
    }, [isExpiredToken])

    const handleResetPassword = useCallback(() => {
        setFinish(false)
        if (password !== passwordConfirm) {
            setCompare("The passwords do not match");
            setFinish(true)
        } else {
            sendPassword({ email: (email as string), password, token: (token as string) }).unwrap()
        }
    }, [password, passwordConfirm]);

    useEffect(() => {
        compare && setCompare(undefined)
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
                stopLoading={finish}
            >
                <div className="login-page__inputs">
                    <Password
                        autoComplete="new-password"
                        value={password}
                        externalSetter={setPassword}
                        placeholder="New Password"
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
