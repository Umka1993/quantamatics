import React, { useCallback, useEffect, useState } from "react";
import { Password } from "../../components/app-input/index";
import Button from "../button";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { AppRoute } from "../../data/enum";
import Form from "./form";

import "./styles/form.scss";
import "./styles/login-page.scss";
import { resetPassword } from "../../store/reset-password/actions";

const ResetPassword: React.FunctionComponent = (props) => {
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [compare, setCompare] = useState<string | undefined>(undefined);

    const [finish, setFinish] = useState<boolean>(false);

    const history = useHistory();
    const dispatch = useDispatch();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    const onFinish = () => history.push(AppRoute.Login);
    const onError = () => setFinish(true);

    const handleResetPassword = useCallback(() => {
        dispatch(resetPassword(password, (token as string), (email as string), onFinish, onError))

    }, [password, passwordConfirm,]);

    useEffect(() => {
        setCompare(
            password !== passwordConfirm ? "The passwords do not match" : undefined
        );
    }, [password, passwordConfirm]);

    return (
        <Form
            headline="Reset Password"
            subtitle="Create a password to complete recovery"
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
};

export default ResetPassword;
