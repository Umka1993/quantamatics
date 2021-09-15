import React, {useState} from "react";
import {Button} from "../../components/button/button";
import "./styles/sign-up.scss"
import {Input} from "../../components/input";

export const SignUpPage: React.FunctionComponent = (props) => {
    const [password, setPassword] = useState<string>('')
    const [passwordConfirm, setPasswordConfirm] = useState<string>('')
    return (
        <div className="sign-up">
            <div className="sign-up__container">
                <div className="sign-up__title">
                    <h2>Sign Up to <span>Dudka.agency</span></h2>
                    <p>Create a password to complete the sign up</p>
                </div>
                <div className="sign-up__inputs">
                    <Input
                        onChangeInput={(value) => setPassword(value)}
                        type={'password'}
                        value={password}
                    />
                    <Input
                        onChangeInput={(value) => setPasswordConfirm(value)}
                        type={'password'}
                        value={passwordConfirm}
                    />
                </div>
                <div className="sign-up__btn">
                    <Button type={'simple'} text={'Save'}/>
                </div>
            </div>
        </div>
    )
}
