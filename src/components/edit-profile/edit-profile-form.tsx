import React, { FormEvent, useState } from "react";
import { Button } from "../button/button";
import { Input } from "../input";
import { IUser } from "../../types/edit-profile/types"
import { DateInput } from "../date-input";
import { SelectorInput } from "../selector-input";
import { USER_ORGS } from "../../contstans/constans";
import editIcon from "./assets/edit.svg"
import "./styles/edit-profile-form.scss"
import { network } from "../../services/networkService";
import { useHistory } from "react-router";

interface IEditProfileForm {
    user: IUser,
    resetFunction: () => void;
    submitFunction?: any
}

export const EditProfileForm: React.FunctionComponent<IEditProfileForm> = ({ user, resetFunction, submitFunction }) => {
    const history = useHistory();

    const initialExp = user.subscriptionEndDate ? new Date(user.subscriptionEndDate.split('.').join('/')) : new Date();

    const [name, setName] = useState<string>(user.firstName)
    const [surname, setSurname] = useState<string>(user.lastName)
    const [organization, setOrganization] = useState<string>(user.companyName)
    const [email, setEmail] = useState<string>(user.email)
    const [expiration, setExpiration] = useState<Date>(initialExp)

    const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const newUserData = {
            email: email,
            firstName: name,
            lastName: surname,
            companyName: organization,
            // companyRole: string,
            // location: string,
            subscriptionType: 0,
            subscriptionEndDate: new Date(expiration)
        }
        network.post('/api/Admin/updateUser', newUserData).then((r: any) => {
            console.log('complete');

            const newUser = {...user, ...newUserData}

            submitFunction(newUser)

            resetFunction();
        })
            .catch(({ response: { data } }) => {
                console.log(data);


            })
    }



    return (
        <form action="" className="edit-profile-form" onSubmit={handlerSubmit}>
            <h2 className="edit-profile-form__title">Edit Profile</h2>

            <div>
                <Input
                    onChangeInput={(value) => setName(value)}
                    value={name}
                    icon={editIcon}
                    name="firstName"
                />
                <Input
                    onChangeInput={(value) => setSurname(value)}
                    value={surname}
                    icon={editIcon}
                    name="lastName"
                />
                <SelectorInput
                    onChangeInput={(value) => setOrganization(value)}
                    options={USER_ORGS}
                    value={organization}
                    disabled
                />
                <Input
                    onChangeInput={(value) => setEmail(value)}
                    value={email}
                    icon={editIcon}
                />
                <DateInput
                    onChangeInput={(value) => setExpiration(value)}
                    minDate={new Date()}
                    disablePastDate
                    value={expiration}
                />
            </div>

            <div className="edit-profile-form__buttons">
                <Button type={"dotted"} text={"Cancel"} onClick={() => resetFunction()} />

                <Button type={"simple"} text={"Save"} htmlType="submit" />
            </div>
        </form>
    );
};
