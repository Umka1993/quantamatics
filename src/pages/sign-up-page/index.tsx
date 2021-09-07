import React from "react";
import {Button} from "../../components/button/button";
import "./styles/sign-up.scss"

export const SignUpPage: React.FunctionComponent = (props) => {
    return(
        <div className="sign-up">
            <div className="sign-up__container">
                <div className="sign-up__title">
                    <h2>Sign Up at <span>Dudka.agency</span></h2>
                    <p>Create a password to complete the sign up</p>
                </div>
                <div className="sign-up__inputs">

                </div>
                <div className="sign-up__btn">
                    <Button type={'simple'} text={'Save'} />
                </div>
            </div>
        </div>
    )
}