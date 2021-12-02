import React, { useCallback, useEffect, useState, FunctionComponent } from "react";
import { Password } from "../../components/app-input/index";
import Button from "../button";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { AppRoute } from "../../data/enum";
import Form from "./form";

import "./styles/form.scss";
import "./styles/login-page.scss";
import { resetPassword } from "../../store/reset-password/actions";
import { useVerifyTokenQuery } from "../../api/account";
import Loader from "../loader";

const SignUp: FunctionComponent = () => {
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [compare, setCompare] = useState<string | undefined>(undefined);

    const [finish, setFinish] = useState<boolean>(false);

    const history = useHistory();
    const dispatch = useDispatch();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");
    const organizationName = urlParams.get("orgName");

    const { isSuccess: isTokenValid, isError: isExpiredToken } = useVerifyTokenQuery({ userName: String(email), token: token as string });

    useEffect(() => {
        isExpiredToken && history.push(AppRoute.ExpiredPassword)
    }, [isExpiredToken])

    const title = (<>Sign Up to <b>{organizationName}</b></>)

    const onFinish = () => history.push(AppRoute.Home);
    const onError = () => setFinish(true);

    const handleResetPassword = useCallback(() => {
        setFinish(false)
        if (password !== passwordConfirm) {
            setCompare("The passwords do not match");
            setFinish(true)
        } else {
            dispatch(resetPassword(password, (token as string), (email as string), onFinish, onError))
        }
    }, [password, passwordConfirm,]);

    useEffect(() => {
        compare && setCompare(undefined)
    }, [password, passwordConfirm])

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
