import React, {useState} from "react";
import "./styles/login-page.scss"
import {Input} from "../../components/input";
import {Loader} from "../../components/loader";
import {Button} from "../../components/button/button";
import {CheckBox} from "../../components/checkbox";
import {network} from "../../services/networkService";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";

export const SignInPage: React.FunctionComponent = (props) => {
    const [userName, setUserName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loginProcess, setLoginProcess] = useState<boolean>(false)
    const [errors, setErrors] = useState<boolean>(false)


    const history = useHistory()
    const dispatch = useDispatch()

    const handleLogin = () => {
        console.log(userName)
        if (userName && password) {
            setLoginProcess(true)
            const body = "grant_type=password&username=" + userName + "&password=" + password
            const options = {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
            network.post('oauth/token', body, options)
                .then((r: any) => {
                    dispatch({
                        type: "LOGIN", payload: {
                            username: userName
                        }
                    })
                    setErrors(false)
                    localStorage.setItem('id_token', r.data.access_token);
                    setLoginProcess(false)
                    history.push('/')
                })
                .catch((e) => {
                    console.log(e)
                    setLoginProcess(false)
                    setErrors(true)
                })
        }
    }

    return (
        <div className="login-page">
            <div className="login-page__container">
                <div className="login-page__title">
                    <h2>Sign in to your account</h2>
                    <p>Enter your email and password to sign in</p>
                </div>
                <div className="login-page__inputs">
                    <Input
                        onChangeInput={(value) => setUserName(value)}
                        placeholder={'User Name'}
                        type={'text'}
                        value={userName}
                        errors={errors}
                    />
                    <Input
                        onChangeInput={(value) => setPassword(value)}
                        placeholder={'Enter the password'}
                        type={'password'}
                        value={password}
                        errors={errors}
                    />
                </div>
                {/*<div className="login-page__wrap">*/}
                {/*    <CheckBox label={'Remember Me'}/>*/}
                {/*    <div className="login-page__forgot">*/}
                {/*        Forgot Password?*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="login-page__btn">
                    <Button onClick={() => handleLogin()} type={'simple'} text={'Sign In'} disabled={!userName || !password}/>
                </div>
            </div>
            {loginProcess && <Loader />}
        </div>
    )
}
