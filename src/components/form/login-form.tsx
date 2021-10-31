import React, { FormEvent, useEffect, useRef, useState } from "react";
import { network } from "../../services/networkService";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { RootState } from "../../store";

import { Input } from "../../components/input";
import Button from "../../components/app-button";
import { CheckBox } from "../../components/checkbox";
import Password from "../../components/app-input/password";
import Form from './form';

import { AppRoute } from "../../data/enum";

import "./styles/form.scss";
import "./styles/login-page.scss";

const LoginForm: React.FunctionComponent = () => {
    const user = useSelector<RootState>((state) => state.user.user.firstName);

    const localUserName = localStorage.getItem("savedUsername") || "";
    const localPassword = localStorage.getItem("savedPassword") || "";

    const [userName, setUserName] = useState<string>(localUserName);
    const [password, setPassword] = useState<string>(localPassword);

    const [finish, setFinish] = useState<boolean | undefined>(undefined);

    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const [errors, setErrors] = useState<string | undefined>(undefined);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!!user) history.push("/research/my-files");
    }, [user]);

    const history = useHistory();
    const dispatch = useDispatch();

    // hide errors on any input
    useEffect(() => {
        errors && setErrors(undefined);
    }, [userName, password]);

    useEffect(() => {        
        formRef.current?.reportValidity();
    }, [errors]);

    const handleLogin = (evt: FormEvent<HTMLFormElement>) => {        
        network
            .post("api/Account/login", {
                email: userName,
                password: password,
            })
            .then((r: any) => {
                console.log(r);
                dispatch({
                    type: "LOGIN",
                    payload: {
                        id: r.data.user.id,
                        email: r.data.user.email,
                        firstName: r.data.user.firstName,
                        lastName: r.data.user.lastName,
                        companyName: r.data.user.companyName,
                        companyRole: r.data.user.companyRole,
                        location: r.data.user.location,
                        subscriptionType: r.data.user.subscriptionType,
                        subscriptionEndDate: r.data.user.subscriptionEndDate,
                        reportPanel: null,
                        expirationDate: r.data.user.expirationDate,
                        avatar: "",
                    },
                });
                setErrors(undefined);
                localStorage.setItem("id_token", r.data.token);
                localStorage.setItem("user", JSON.stringify(r.data.user));
                if (rememberMe) {
                    localStorage.setItem("savedUsername", userName);
                    localStorage.setItem("savedPassword", password);
                }

                setFinish(true);

                history.push(AppRoute.Home);
                //? history.push("/apps/organizations/list");
            })
            .catch((e) => {
                if (e.response.status >= 400) {
                    setErrors("Incorrect username or password");
                } else {
                    setErrors("Something went wrong");
                }                
                setFinish(true);
            });
    };

    return (
        <Form 
            onSubmit={handleLogin} 
            title='Sign in to your account' 
            subtitle='Enter your email and password'
            stopLoading={finish}
            ref={formRef}
        >
            <div className="login-page__inputs">
                <Input
                    onChangeInput={(value) => setUserName(value)}
                    placeholder={"Enter the username"}
                    type={"text"}
                    value={userName}
                    errors={!!errors}
                    name="email"
                />

                <Password
                    placeholder={"Enter the password"}
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
                    onClick={(value) => setRememberMe(value)}
                    label={"Remember Me"}
                />
                <Link to={AppRoute.ForgoPassword} className="login-page__forgot">
                    Forgot Password?
                </Link>
            </div>
            <div className="login-page__btn">
                <Button disabled={!userName || !password} type="submit">
                    Sign In
                </Button>
            </div>
        </Form>
    );
};

export default LoginForm;
