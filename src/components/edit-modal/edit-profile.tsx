import React, { FormEvent, useEffect, useRef, useState } from "react";

import Button, { ResetButton } from "../button";
import AppInput, { DatePick, Email } from "../app-input";
import { SelectorInput } from "../selector-input";
import { USER_ORGS } from "../../contstans/constans";
import Modal from "../modal";
import RoleCheckboxes from "../role-checkboxes";

import "./styles/edit-account.scss";
import { UserRole } from "../../data/enum";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/admin/actions";
import { IUpdateUser, IUser } from "../../types/user";
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
    const [userRoles, setRoles] = useState<UserRole[]>(user.userRoles)
    const dispatch = useDispatch()

    const formRef = useRef<HTMLFormElement>(null);

    
    const sendNewUser = (validate: any) => {
        let newUserData: IUpdateUser = {
            ...user,
            firstName: name,
            lastName: surname,
            companyName: organization,
            subscriptionEndDate: new Date(expiration),
            userRoles,
        };


        if (email !== user.email) {
            newUserData = {
                ...newUserData,
                newEmail: email,
            };
        }

        const onFinish = () => {
            onSubmit(newUserData);
            onClose();
        }

        dispatch(updateUser(newUserData, onFinish, setEmailError))
    };

    const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        console.log("asd");

        setValidate(true);

        const isValid = formRef.current?.reportValidity();

        if (isValid) {
            sendNewUser(validate);
        }
    };

    useEffect(() => {
        emailError && setEmailError(undefined);
    }, [email]);

    useEffect(() => {
        emailError && formRef.current?.reportValidity();
    }, [emailError]);

    return (
        <Modal onClose={onClose} className="edit-account" headline="Edit Account">
            <form
                id="edit-account-form"
                action=""
                className="edit-account__form-account"
                onSubmit={handlerSubmit}
                noValidate={validate ? undefined : true}
                ref={formRef}
            >
                <AppInput
                    externalSetter={setName}
                    value={name}
                    name="firstName"
                    icon="edit"
                />
                <AppInput
                    externalSetter={setSurname}
                    value={surname}
                    name="lastName"
                    icon="edit"
                />
                <SelectorInput
                    onChangeInput={(value) => setOrganization(value)}
                    options={USER_ORGS}
                    value={organization}
                    disabled
                />
                <Email
                    externalSetter={setEmail}
                    value={email}
                    error={emailError}
                    icon="edit"
                />
                <DatePick externalSetter={setExpiration} valueAsDate={expiration} />
                <RoleCheckboxes
                    defaultRoles={userRoles}
                    externalSetter={setRoles}
                />
            </form>

            <footer className="edit-account__footer">
                <ResetButton onClick={onClose}>Cancel</ResetButton>
                <Button type="submit" form="edit-account-form">
                    Save
                </Button>
            </footer>
        </Modal>
    );
};
