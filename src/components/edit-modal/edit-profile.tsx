import React, { FormEvent, useEffect, useRef, useState } from "react";

import Button, { ResetButton } from "../button";
import { IUser } from "../../types/edit-profile/types";
import { network } from "../../services/networkService";

import AppInput, { DatePick, Email } from "../app-input";
import Checkbox from "../app-checkbox/checkbox";
import { SelectorInput } from "../selector-input";
import { USER_ORGS } from "../../contstans/constans";
import Modal from "../modal";

import "./styles/edit-account.scss";
import { UserRole } from "../../data/enum";
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

    const [orgAdmin, setOrgAdmin] = useState<boolean>(user.userRoles.includes(UserRole.OrgAdmin));
    const [research, setResearch] = useState<boolean>(user.userRoles.includes(UserRole.Research));
    const [coherence, setCoherence] = useState<boolean>(user.userRoles.includes(UserRole.Coherence));
    const formRef = useRef<HTMLFormElement>(null);

    const updateUser = (validate: any) => {
        let newUserData: any = {
            ...user,
            firstName: name,
            lastName: surname,
            companyName: organization,
            subscriptionEndDate: new Date(expiration),
            userRoles: [],
        };

        orgAdmin && newUserData.userRoles.push(UserRole.OrgAdmin);
        research && newUserData.userRoles.push(UserRole.Research);
        coherence && newUserData.userRoles.push(UserRole.Coherence);

        if (email !== user.email) {
            newUserData = {
                ...newUserData,
                newEmail: email,
            };
        }

        network
            .post("/api/Admin/updateUser", newUserData)
            .then((r: any) => {
                onSubmit(newUserData);

                onClose();
            })
            .catch(({ response: { data } }) => {
                if (data.includes(" already taken")) {
                    setEmailError("The user with such email already exists");
                }
            });
    };

    const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        console.log("asd");

        setValidate(true);

        const isValid = formRef.current?.reportValidity();

        if (isValid) {
            updateUser(validate);
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
                <fieldset className="edit-account__fieldset">
                    <legend>Organization Role</legend>

                    <Checkbox
                        name="org-admin"
                        checked={orgAdmin}
                        externalSetter={setOrgAdmin}
                    >
                        Org. Admin
                    </Checkbox>
                    <Checkbox
                        name={UserRole.Research}
                        checked={research}
                        externalSetter={setResearch}
                    >
                        {UserRole.Research}
                    </Checkbox>
                    <Checkbox
                        name={UserRole.Coherence}
                        checked={coherence}
                        externalSetter={setCoherence}
                    >
                        {UserRole.Coherence}
                    </Checkbox>
                </fieldset>
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
