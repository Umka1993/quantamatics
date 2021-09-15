import React, {useState} from "react";
import "./styles/login-page.scss"
import {Input} from "../../components/input";
import {Button} from "../../components/button/button";
import {CheckBox} from "../../components/checkbox";
import {network} from "../../services/networkService";
import {useDispatch} from "react-redux";

export const SignInPage: React.FunctionComponent = (props) => {
    const [userName, setUserName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const dispatch = useDispatch()
    const handleLogin = () => {
        console.log(userName)
        if (userName && password) {
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
                    localStorage.setItem('id_token', r.data.access_token);
                })
                .catch((e) => console.log(e))
        }
    }

    return (
        <div className="login-page">
            <div className="login-page__container">
                <div className="login-page__title">
                    <h2>Sign In to <span>Dudka.agency</span></h2>
                    <p>Enter your email and password to log in</p>
                </div>
                <div className="login-page__inputs">
                    <Input
                        onChangeInput={(value) => setUserName(value)}
                        placeholder={'User Name'}
                        type={'text'}
                        value={userName}
                    />
                    <Input
                        onChangeInput={(value) => setPassword(value)}
                        placeholder={'Enter the password'}
                        type={'password'}
                        value={password}
                    />
                </div>
                <div className="login-page__wrap">
                    <CheckBox label={'Remember Me'}/>
                    <div className="login-page__forgot">
                        Forgot Password?
                    </div>
                </div>
                <div className="login-page__btn" onClick={() => handleLogin()}>
                    <Button type={'simple'} text={'Enter the platform'}/>
                </div>
            </div>
        </div>
    )
}
