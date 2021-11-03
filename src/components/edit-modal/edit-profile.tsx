import React, { FormEvent, useEffect, useRef, useState } from "react";

import Button, { ResetButton } from "../button";
import { Input } from "../input";
import { IUser } from "../../types/edit-profile/types";
import { network } from "../../services/networkService";

import { DatePick, Email } from "../app-input";
import { SelectorInput } from "../selector-input";
import { USER_ORGS } from "../../contstans/constans";
import editIcon from "./assets/edit.svg";
import ProfileSummary from "../profile-summary";
import Modal from "../modal";
import Headline from "../page-title/index";

import "./styles/edit-modal.scss";
interface IEditProfile {
    onClose: () => void;
    user: IUser;
    onSubmit: any;
}

export const EditProfile: React.FunctionComponent<IEditProfile> = ({
    onClose,
    user,
    onSubmit,
}) => {
    const initialExp = user.subscriptionEndDate
        ? new Date(user.subscriptionEndDate.split(".").join("/"))
        : new Date();

    const [name, setName] = useState<string>(user.firstName);
    const [surname, setSurname] = useState<string>(user.lastName);
    const [organization, setOrganization] = useState<string>(user.companyName);
    const [email, setEmail] = useState<string>(user.email);
    const [expiration, setExpiration] = useState<Date>(initialExp);

    const [emailError, setEmailError] = useState<string | undefined>(undefined);
    const [validate, setValidate] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null)

    const updateUser = (validate: any) => {
        let newUserData: any = {
            ...user,
            firstName: name,
            lastName: surname,
            companyName: organization,
            subscriptionEndDate: new Date(expiration),
        };

        if (email !== user.email) {
            newUserData = {
                ...newUserData,
                newEmail: email
            };
        }

        network
            .post("/api/Admin/updateUser", newUserData)
            .then((r: any) => {
                onSubmit(newUserData);

                onClose();
            })
            .catch(({ response: { data } }) => {

                if (data.includes(' already taken')) {
                    setEmailError('The user with such email already exists')
                }                
            });
    };


    const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        setValidate(true);

        const isValid = formRef.current?.reportValidity();

        if (isValid) {

            updateUser(validate);
        }
    };

    const handlerReset = (evt: FormEvent<HTMLFormElement>) => {
        onClose();
    };

    useEffect(() => {
        emailError && setEmailError(undefined);
    }, [email]);

    useEffect(() => {
        emailError && formRef.current?.reportValidity();
    }, [emailError]);

    return (
        <Modal onClose={onClose} className="edit-profile">
            <ProfileSummary
                user={{
                    ...user,
                    firstName: name,
                    lastName: surname,
                    companyName: organization,
                    email,
                    subscriptionEndDate: expiration.toLocaleDateString(),
                }}
                className="edit-profile__summary"
            />
            <form
                action=""
                className="edit-profile__form"
                onSubmit={handlerSubmit}
                onReset={handlerReset}
                noValidate={validate ? undefined : true}
                ref={formRef}
            >
                <Headline id="modal-label" className="edit-profile__title">
                    Edit Profile
                </Headline>

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
                    <Email
                        className="edit-profile__temp-input"
                        externalSetter={setEmail}
                        value={email}
                        error={emailError}
                        icon="edit"
                    />
                    <DatePick
                        className="edit-profile__temp-input"
                        externalSetter={setExpiration}
                        valueAsDate={expiration}
                    />
                </div>

                <div className="edit-profile__buttons">
                    <ResetButton>Cancel</ResetButton>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Modal>
    );
};
