import React, {useState} from "react";
import "./styles/add-user-account.scss"
import {Input} from "../input";
import {Button} from "../button/button";
import arrowIcon from "./assets/arrow.svg"
import SVG from "../SVG";
import {DateInput} from "../date-input";

interface IAddUserAccount {
    onBack: () => void
}

export const AddUserAccount: React.FunctionComponent<IAddUserAccount> = (props) => {

    const [userName, setUserName] = useState<string>('')
    const [userLastName, setUserLastName] = useState<string>('')
    const [userEmail, setUserEmail] = useState<string>('')
    const [userExpiration, setUserExpiration] = useState<any>(null)


    return (
        <div className="add-user-account">
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
                <DateInput
                    onChangeInput={(value)=>setUserExpiration(value)}
                    placeholder='Expiration Date'
                    value={userExpiration}
                />

                <div className="add-user-account__form-btn-save">
                    <Button type={'simple'} text={'Save'}/>
                </div>
                <div className="add-user-account__form-btn-cancel" onClick={props.onBack}>
                    <Button type={'dotted'} text={'Cancel'}/>
                </div>
            </div>
        </div>
    )
}
