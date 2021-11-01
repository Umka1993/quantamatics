import React, { FormEvent, useEffect, useRef, useState } from "react";

import Button, { ResetButton } from "../app-button/index"
import { Input } from "../input";
import { IUser } from "../../types/edit-profile/types";
import { network } from "../../services/networkService";

import { DatePick, Email } from "../app-input";
import { SelectorInput } from "../selector-input";
import { USER_ORGS } from "../../contstans/constans";
import editIcon from "./assets/edit.svg";
import ProfileSummary from "../profile-summary";
import Modal from "../modal";
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

    const updateUser = () => {
        const newUserData = {
            email: email,
            firstName: name,
            lastName: surname,
            companyName: organization,
            // companyRole: string,
            // location: string,
            subscriptionType: 0,
            subscriptionEndDate: new Date(expiration),
        };

        network
            .post("/api/Admin/updateUser", newUserData)
            .then((r: any) => {
                const newUser = { ...user, ...newUserData };

                onSubmit(newUser);

                onClose();
            })
            .catch(({ response: { data } }) => {
                console.log(data);

                if (data.errors) {
                    data.errors.Email &&
                        setEmailError("This is not a valid e-mail address.");
                }
            });
    };

    /*     const checkEmailToExist = () => {
            network
                .post("/api/Account/register", {
                    firstName: name,
                    lastName: surname,
                    email: email,
                })
                .then((r: any) => {
                    // console.log("is new");
                    updateUser();
                })
                .catch(({ response: { data } }) => {
                    // console.log("is wrong", data);
                    if (data[0]) {
                        const { code } = data[0];
                        if (code === "DuplicateUserName") {
                            // console.log('exist');
                            setEmailError("The user with such email already exists");
                        }
                    }
                });
        };
         */
    const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        setValidate(true)

        const isValid = (evt.target as HTMLFormElement).reportValidity();

        if (isValid) {
            updateUser();
        }
    };

    const handlerReset = (evt: FormEvent<HTMLFormElement>) => {
        onClose();
    };

    useEffect(() => {
        emailError && setEmailError(undefined)
    }, [emailError])

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
                noValidate={validate ? true : undefined}
            >
                <h2 id="modal-label" className="modal__title edit-profile__title">
                    Edit Profile
                </h2>

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
                        // icon='edit'
                        disabled
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
