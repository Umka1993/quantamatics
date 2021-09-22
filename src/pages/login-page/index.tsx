import React, {useEffect, useState} from "react";
import "./styles/login-page.scss"
import {Input} from "../../components/input";
import {Loader} from "../../components/loader";
import {Button} from "../../components/button/button";
import {CheckBox} from "../../components/checkbox";
import {network} from "../../services/networkService";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {RootState} from "../../store";

export const SignInPage: React.FunctionComponent = (props) => {
    const user = useSelector<RootState>((state) => state.user.user.username)
    const [userName, setUserName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loginProcess, setLoginProcess] = useState<boolean>(false)
    const [errors, setErrors] = useState<string>('')
    if (!!user) return <div/>

    useEffect(() => {
        if(!!user) history.push('/')
    }, [user])

    useEffect(() => {
      const handleKeyUp = (e: any) => {
        if (e.keyCode === 13) {
          handleLogin()
        }
      }

      window.document.addEventListener('keyup', handleKeyUp);

      return () => {
        window.document.removeEventListener('keyup', handleKeyUp);
      }
    }, []);

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
                    setErrors('false')
                    localStorage.setItem('id_token', r.data.access_token);
                    setLoginProcess(false)
                    history.push('/')
                })
                .catch((e) => {
                    console.log(e)
                    setLoginProcess(false)
                    setErrors(e)
                })
        } else {
            setErrors('Enter user name and password')
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
                        placeholder={'Enter the login'}
                        type={'text'}
                        value={userName}
                        errors={!!errors}
                        onEnterPress={() => handleLogin()}
                    />
                    <Input
                        onChangeInput={(value) => setPassword(value)}
                        placeholder={'Enter the password'}
                        type={'password'}
                        value={password}
                        errors={!!errors}
                        onEnterPress={() => handleLogin()}
                    />
                    {!!errors && (<div className="login-page__inputs-errors">{errors}</div>)}
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
