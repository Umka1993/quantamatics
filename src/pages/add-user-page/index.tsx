import React, {useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/add-user.scss"
import {Input} from "../../components/input";
import {DateInput} from "../../components/date-input";
import {Button} from "../../components/button/button";
import successIcon from "./assets/sucess-icon.svg";
import SVG from "../../components/SVG";

export const AddUserPage: React.FunctionComponent = (props) => {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [date, setDate] = useState<any>(null)
    const [showSuccess, setShowSuccess] = useState<boolean>(false)
    return(
        <div className="add-user-page">
            <div className="add-user-page__content">
                <div className='add-user-page__title'>Add User Accounts</div>
                <div className='add-user-page__subtitle'>Add users to your organization and manage them</div>
                <Input
                    className='add-user-page__first-input'
                    onChangeInput={(value)=>setFirstName(value)}
                    placeholder='First Name'
                    value={firstName}
                />
                <Input
                    onChangeInput={(value)=>setLastName(value)}
                    placeholder='Last Name'
                    value={lastName}
                />
                <Input
                    onChangeInput={(value)=>setEmail(value)}
                    placeholder='Email Address'
                    value={email}
                />
                <DateInput
                    onChangeInput={(value)=>setDate(value)}
                    placeholder='Expiration Date'
                    value={date}
                />

                <div className='add-user-page__submit' onClick={() => setShowSuccess(true)}><Button type={'simple'} text={'Save'}/></div>
                <div className='add-user-page__cancel'><Button type={'dotted'} text={'Cancel'}/></div>
            </div>
            {showSuccess && (
                <div className='add-user-page__success'>
                    <div className='add-user-page__success-text'><SVG icon={successIcon}/>An invitation email has been sent
                        to the user
                    </div>
                    <div className='add-user-page__success-btn' onClick={() => setShowSuccess(false)}><Button
                        type={'simple'} text={'Go Back'}/></div>
                </div>
            )}
        </div>
    )
}
