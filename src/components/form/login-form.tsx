import React, { FormEvent, useEffect, useRef, useState } from "react";
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
import { loginAction } from "../../store/authorization/actions";

const LoginForm: React.FunctionComponent = () => {
    const user = useSelector<RootState>((state) => state.user.user.firstName);

    const localUserName = localStorage.getItem("savedUsername") || "";
    const localPassword = localStorage.getItem("savedPassword") || "";

    const [userName, setUserName] = useState<string>(localUserName);
    const [password, setPassword] = useState<string>(localPassword);

    const [finish, setFinish] = useState<boolean | undefined>(undefined);

    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const [errors, setErrors] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!!user) history.push("/research/my-files");
    }, [user]);

    const history = useHistory();
    const dispatch = useDispatch();

    // hide errors on any input
    useEffect(() => {
        errors && setErrors(undefined);
    }, [userName, password]);

    const onFinish = () => {
        setErrors(undefined);  
        if (rememberMe) {
            localStorage.setItem("savedUsername", userName);
            localStorage.setItem("savedPassword", password);
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
        dispatch(loginAction([userName, password, onFinish, onError]))
    };

    return (
        <Form 
            onSubmit={handleLogin} 
            title='Sign in to your account' 
            subtitle='Enter your email and password'
            stopLoading={finish}
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
