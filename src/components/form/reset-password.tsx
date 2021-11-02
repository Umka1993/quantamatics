import React, { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Password } from "../../components/app-input/index";
import Button from "../../components/app-button/";
import { network } from "../../services/networkService";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "../../store";
import { AppRoute } from "../../data/enum";
import Form from "./form";

import "./styles/form.scss";
import "./styles/login-page.scss";

const ResetPassword: React.FunctionComponent = (props) => {
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [compare, setCompare] = useState<string | undefined>(undefined);

    const [finish, setFinish] = useState<boolean>(false);

    // const [errors, setErrors] = useState<string | undefined>(undefined);

    // const formRef = useRef<HTMLFormElement>(null);

    // const history = useHistory();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    const handleResetPassword = useCallback(() => {
        if (password && passwordConfirm && email) {
        //     setLoginProcess(true);
        //     network
        //         .post("/api/Account/resetPassword", {
        //             password,
        //             token,
        //             email,
        //         })
        //         .then((r: any) => {
        //             setLoginProcess(false);
        //             history.push("/login");
        //         })
        //         .catch((e) => {
        //             console.log(e);
        //         });
        }
    }, [password, passwordConfirm, ]); //email

    useEffect(() => {
        setCompare(
            password !== passwordConfirm ? "The passwords do not match" : undefined
        );
    }, [password, passwordConfirm]);

    return (
        <Form
            title="Reset Password"
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
