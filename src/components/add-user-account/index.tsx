import React, {useState} from "react";
import "./styles/add-user-account.scss"
import {Input} from "../input";
import {Button} from "../button/button";
import arrowIcon from "./assets/arrow.svg"
import SVG from "../SVG";

interface IAddUserAccount {
    onBack: () => void
}

export const AddUserAccount: React.FunctionComponent<IAddUserAccount> = (props) => {

    const [userName, setUserName] = useState<string>('')
    const [userLastName, setUserLastName] = useState<string>('')
    const [userEmail, setUserEmail] = useState<string>('')


    return (
        <div className="add-user-account">
            <div className="add-user-account__header">
                <div className="add-user-account__button"
                     onClick={() => props.onBack()}>
                    <SVG icon={arrowIcon}/>
                    <span>Back</span>
                </div>
            </div>
            <div className="add-user-account__form">
                <h2>Add User Accounts</h2>
                <Input onChangeInput={(value) => setUserName(value)}
                       placeholder="Name"
                       value={userName}
                />
                <Input onChangeInput={(value) => setUserLastName(value)}
                       placeholder="Last name"
                       value={userLastName}
                />
                <Input onChangeInput={(value) => setUserEmail(value)}
                       placeholder="Email Address"
                       value={userEmail}
                />

                <div className="add-user-account__form-btn-save">
                    <Button type={'simple'} text={'Save'}/>
                </div>
                <div className="add-user-account__form-btn-cancel">
                    <Button type={'dotted'} text={'Cancel'}/>
                </div>
            </div>
        </div>
    )
}