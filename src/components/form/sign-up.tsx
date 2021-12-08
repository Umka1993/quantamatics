import React, { useCallback, useEffect, useState, FunctionComponent } from "react";
import { Password } from "../../components/app-input/index";
import Button from "../button";
import { useHistory } from "react-router-dom";
import { AppRoute } from "../../data/enum";
import Form from "./form";

import "./styles/form.scss";
import "./styles/login-page.scss";
import { useLoginUserMutation, useResetPasswordMutation, useVerifyTokenQuery } from "../../api/account";
import Loader from "../loader";
import { processLogin } from "../../services/processLogin";
import { useDispatch } from "react-redux";
import { IUser } from "types/user";
import { login } from "../../store/authorization";

const SignUp: FunctionComponent = () => {
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [compare, setCompare] = useState<string | undefined>(undefined);

    const [finish, setFinish] = useState<boolean>(false);

    const history = useHistory();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");
    const organizationName = urlParams.get("orgName");
    const dispatch = useDispatch()

    const [sendPassword, { isSuccess: isPasswordUpdated, isError: isPasswordError }] = useResetPasswordMutation();
    const [sendlogin, { isSuccess: isLogged, data: loggedData }] = useLoginUserMutation();

    const { isSuccess: isTokenValid, isError: isExpiredToken } = useVerifyTokenQuery({ userName: String(email), token: token as string });

    useEffect(() => {
        isExpiredToken && history.push(AppRoute.SignUpExpired)
    }, [isExpiredToken])

    const title = (<>Sign Up to <b>{organizationName}</b></>)

    const handleResetPassword = useCallback(() => {
        setFinish(false)
        if (password !== passwordConfirm) {
            setCompare("The passwords do not match");
            setFinish(true)
        } else {
            sendPassword({ email: (email as string), password, token: (token as string) }).unwrap();
        }
    }, [password, passwordConfirm]);

    useEffect(() => {
        compare && setCompare(undefined)
    }, [password, passwordConfirm])

    useEffect(() => {
        isPasswordError && setFinish(true)
    }, [isPasswordError])

    useEffect(() => {
        if (isLogged && loggedData) {
            const setUserToStore = (user: IUser) => dispatch(login(user));
            history.push(processLogin(loggedData, setUserToStore, true))

        }
    }, [isLogged])

    useEffect(() => {
        isPasswordUpdated && sendlogin({ email: (email as string), password }).unwrap();
    }, [isPasswordUpdated])

    if (isTokenValid) {
        return (
            <Form
                headline={title}
                headlineText={`Sign Up ${organizationName}`}
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
    } else {
        return (<Loader />)
    }

};

export default SignUp;
