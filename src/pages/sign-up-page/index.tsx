import React, {useCallback, useState} from "react";
import {Button} from "../../components/button/button";
import "./styles/sign-up.scss"
import {Input} from "../../components/input";
import {network} from "../../services/networkService";
import {useHistory} from "react-router-dom";
import {Loader} from "../../components/loader";

export const SignUpPage: React.FunctionComponent = (props) => {
    const resetPassword = window.location.pathname.substring(1).includes('reset-password')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirm, setPasswordConfirm] = useState<string>('')
    const [loginProcess, setLoginProcess] = useState<boolean>(false)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token')
    const email = urlParams.get('email')
    const organizationName = urlParams.get('orgName')

    const history = useHistory()

    const handleResetPassword = useCallback(() => {
        if (password && passwordConfirm && email) {
            setLoginProcess(true)
            network.post('/api/Account/resetPassword', {
                password,
                token,
                email
            })
                .then((r: any) => {
                    setLoginProcess(false)
                    history.push("/login");
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }, [password, passwordConfirm, email])

    const handleConfirmUser = useCallback(() => {
        if (password && passwordConfirm) {
            setLoginProcess(true)
            network.post('/api/Account/resetPassword', {
                password,
                token,
                email
            })
                .then((r: any) => {
                    setLoginProcess(false)
                    history.push("/");
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }, [password, passwordConfirm])
    return (
        <div className="sign-up">
            <div className="sign-up__container">
                {resetPassword && (<div className="sign-up__title">
                    <h2>Reset Password</h2>
                    <p>Create a password to complete recovery</p>
                </div>)}
                {resetPassword || (<div className="sign-up__title">
                    <h2>Sign Up to <span>{organizationName}</span></h2>
                    <p>Create a password to complete the sign up</p>
                </div>)}
                <div className="sign-up__inputs">
                    <Input
                        onChangeInput={(value) => setPassword(value)}
                        type={'password'}
                        placeholder='New Password'
                        value={password}
                    />
                    <Input
                        onChangeInput={(value) => setPasswordConfirm(value)}
                        type={'password'}
                        placeholder='Confirm New Password'
                        value={passwordConfirm}
                    />
                </div>
                <div className="sign-up__btn" onClick={() => resetPassword ? handleResetPassword() : handleConfirmUser()}>
                    <Button disabled={!password || !passwordConfirm} type={'simple'} text={'Save'}/>
                </div>
            </div>
            {loginProcess && <Loader />}
        </div>
    )
}
