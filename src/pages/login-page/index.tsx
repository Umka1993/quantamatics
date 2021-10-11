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
import SVG from "../../components/SVG";
import successIcon from "../add-user-page/assets/sucess-icon.svg";

export const SignInPage: React.FunctionComponent = (props) => {
    const user = useSelector<RootState>((state) => state.user.user.username)
    const localUserName = localStorage.getItem('savedUsername') || ''
    const localPassword = localStorage.getItem('savedPassword') || ''

    const [userName, setUserName] = useState<string>(localUserName)
    const [password, setPassword] = useState<string>(localPassword)
    const [forgotEmail, setForgotEmail] = useState<string>('')

    const [loginProcess, setLoginProcess] = useState<boolean>(false)

    const [rememberMe, setRememberMe] = useState<boolean>(false)
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false)
    const [showSuccessForgot, setShowSuccessForgot] = useState<boolean>(false)

    const [errors, setErrors] = useState<string>('')

    useEffect(() => {
        if(!!user) history.push('/research/my-files')
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
                    localStorage.setItem('username', userName);
                    if (rememberMe) {
                        localStorage.setItem('savedUsername', userName);
                        localStorage.setItem('savedPassword', password);
                    }

                    setLoginProcess(false)
                    history.push('/')
                    history.push('/apps/organizations/list')
                })
                .catch((e) => {
                    console.log(e)
                    setLoginProcess(false)
                    setErrors(e)
                })
        } else {
            setErrors('Enter username and password')
        }
    }
    if (!!user) return <div/>

    return (
        <div className="login-page">
            <div className="login-page__container">
                <div className="login-page__title">
                    <h2>Sign in to your account</h2>
                    <p>Enter your email and password</p>
                </div>
                <div className="login-page__inputs">
                    <Input
                        onChangeInput={(value) => setUserName(value)}
                        placeholder={'Enter the username'}
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
                <div className="login-page__wrap">
                    <CheckBox checked={rememberMe} onClick={(value) => setRememberMe(value)} label={'Remember Me'}/>
                    <div className="login-page__forgot" onClick={() => setShowForgotPassword(true)}>
                        Forgot Password?
                    </div>
                </div>
                <div className="login-page__btn">
                    <Button onClick={() => handleLogin()} type={'simple'} text={'Sign In'} disabled={!userName || !password}/>
                </div>
            </div>
            {showForgotPassword && (<div className="login-page__forgot-password">
                <div className="login-page__container">
                    <div className="login-page__title">
                        <h2>Forgot your password?</h2>
                        <p>To restore the password, enter your email</p>
                    </div>
                    <div className="login-page__inputs">
                        <Input
                            onChangeInput={(value) => setForgotEmail(value)}
                            placeholder={'Enter the email'}
                            type={'text'}
                            value={forgotEmail}
                            onEnterPress={() => console.log(forgotEmail)}
                        />
                    </div>
                    <div className="login-page__btn">
                        <Button onClick={() => setShowSuccessForgot(true)} type={'simple'} text={'Save'}
                                disabled={!forgotEmail}/>
                        <div className="login-page__btn-cancel" onClick={() => setShowForgotPassword(false)}>
                            <Button type={'dotted'} text={'Cancel'}/>
                        </div>
                    </div>
                </div>
            </div>)}
            {showSuccessForgot && (<div className="login-page__forgot-password success">
                <div className="login-page__container">
                    <div className='login-page__forgot-password-success-text'>
                        <SVG icon={successIcon}/>A reset password email was sent to the email entered
                    </div>
                    <div className="login-page__btn">
                        <Button onClick={() => {
                            setShowSuccessForgot(false)
                            setShowForgotPassword(false)
                        }} type={'simple'} text={'Go to Log in Page'}/>
                    </div>
                </div>
            </div>)}
            {loginProcess && <Loader />}
        </div>
    )
}
