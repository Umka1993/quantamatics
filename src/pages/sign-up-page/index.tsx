import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "../../components/button/button";
import "./styles/sign-up.scss"
import { network } from "../../services/networkService";
import { useHistory } from "react-router-dom";
import { Loader } from "../../components/loader";
import { NewPassword } from "../../components/input/new-password";

export const SignUpPage: React.FunctionComponent = (props) => {
    const resetPassword = window.location.pathname.substring(1).includes('reset-password')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirm, setPasswordConfirm] = useState<string>('')
    const [loginProcess, setLoginProcess] = useState<boolean>(false)
    const [validate, setValidate] = useState<boolean>(false)
    const [enableSubmit, setEnableSubmit] = useState<boolean>(false)

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

    const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setValidate(true);

        resetPassword ? handleResetPassword() : handleConfirmUser();
    }

    useEffect(()=> {

        setEnableSubmit(password.length >= 8 && passwordConfirm.length >= 8)

    }, [password, passwordConfirm])

    

    return (
        <form className="sign-up" onSubmit={handleSubmit} onInvalid={() => console.log('test')
        }>
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
                    <NewPassword password={password} confirm={passwordConfirm}
                        setters={[setPassword, setPasswordConfirm]}
                        validate={validate}
                        onInvalid={() => setEnableSubmit(false)}
                    />
                </div>

                <div className="sign-up__btn">
                    <Button disabled={!enableSubmit} type={'simple'} text={'Save'} htmlType='submit' />
                </div>
            </div>
            {loginProcess && <Loader />}
        </form>
    )
}
