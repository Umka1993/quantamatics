import React, { FormEvent, useState } from "react";
import { Button } from "../button/button";
import { Input } from "../input";
import { User } from "../../types/edit-profile/types"
import { DateInput } from "../date-input";
import { SelectorInput } from "../selector-input";
import { USER_ORGS } from "../../contstans/constans";
import editIcon from "./assets/edit.svg"
import "./styles/edit-profile-form.scss"
import { network } from "../../services/networkService";

interface IEditProfileForm {
    user: User,
    resetFunction: () => void;
}

export const EditProfileForm: React.FunctionComponent<IEditProfileForm> = ({ user, resetFunction }) => {

    const [name, setName] = useState<string>(user.name)
    const [surname, setSurname] = useState<string>(user.surname)
    const [organization, setOrganization] = useState<string>(user.organization)
    const [email, setEmail] = useState<string>(user.email)
    const [expiration, setExpiration] = useState<Date>(new Date(user.exp_date.split('.').join('/')))

    const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        network.post('/api/Admin/updateUser', {
            email: email,
            firstName: name,
            lastName: surname,
            companyName: organization,
            // companyRole: string,
            // location: string,
            subscriptionType: 0,
            subscriptionEndDate: new Date(expiration)

        }).then((r: any) => {
            console.log('complete');

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
