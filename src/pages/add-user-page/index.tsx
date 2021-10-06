import React, {useState} from 'react';
import "./styles/add-user.scss"
import {Input} from "../../components/input";
import {Button} from "../../components/button/button";

export const AddUserPage: React.FunctionComponent = (props) => {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [date, setDate] = useState<string | undefined>('')
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
            <Input
                onChangeInput={(value)=>setDate(value)}
                placeholder='Expiration Date'
                value={date}
            />
            <div className='add-user-page__submit' onClick={() => {}}><Button type={'simple'} text={'Save'}/></div>
            <div className='add-user-page__cancel'><Button type={'dotted'} text={'Cancel'}/></div>
        </div>
        </div>
    )
}
