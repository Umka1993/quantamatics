import React, { FormEvent, useEffect, useRef, useState } from "react";

import Button, { ResetButton } from "../app-button/index"
import Password from "../app-input/password";
import { IUser } from "../../types/edit-profile/types";
import { network } from "../../services/networkService";

import ProfileSummary from "../profile-summary";
import Modal from "../modal";
import "./styles/edit-modal.scss";
import { AxiosError, AxiosResponse } from "axios";
import Headline from "../page-title/index";

interface IEditProfile {
    onClose: () => void;
    user: IUser;
}

export const EditPassword: React.FunctionComponent<IEditProfile> = ({
    onClose,
    user,
}) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [wrongCurrent, setWrongCurrent] = useState<string | undefined>(
        undefined
    );
    const [compare, setCompare] = useState<string | undefined>(undefined);

    const [validateNew, setValidateNew] = useState<boolean>(false);

    const formRef = useRef<HTMLFormElement>(null)


    useEffect(() => {
        wrongCurrent && setWrongCurrent(undefined);
    }, [currentPassword]);




    useEffect(() => {
        if (!!newPassword.length && !!confirmPassword.length) {
            setCompare(
                newPassword !== confirmPassword ? "The passwords do not match" : undefined
            );
        }
    }, [newPassword, confirmPassword])

    const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        setValidateNew(true)
        if (formRef.current?.checkValidity()) {
            network
                .put("api/Account/changePassword", {
                    currentPassword: currentPassword,
                    newPassword: newPassword
                }).then(({ data }: any) => {
                    console.log(data);

                    onClose()

                }).catch(({ response }: AxiosError) => {
                    console.log(response);
                    setWrongCurrent("Current password is incorrect");
                })
        }
    };

    return (
        <Modal onClose={onClose} className="edit-profile">
            <ProfileSummary user={user} className="edit-profile__summary" />
            <form
                action=""
                className="edit-profile__form"
                onSubmit={handlerSubmit}
                onReset={onClose}
                ref={formRef}
            // noValidate={!validateNew}
            >
                <Headline id="modal-label" className="edit-profile__title">
                    Change Password
                </Headline>
                
                <div className="edit-profile__temp edit-profile__inputs">
                    <Password
                        placeholder="Current Password"
                        value={currentPassword}
                        externalSetter={setCurrentPassword}
                        name="password"
                        autoComplete="current-password"
                        error={wrongCurrent}
                    // triggerValidity={Boolean(wrongCurrent)}
                    />

                    <Password
                        autoComplete="new-password"
                        value={newPassword}
                        externalSetter={setNewPassword}
                        placeholder="New Password"
                        formNoValidate={validateNew}
                    />
                    <Password
                        autoComplete="new-password"
                        value={confirmPassword}
                        externalSetter={setConfirmPassword}
                        placeholder="Confirm New Password"
                        formNoValidate={validateNew}
                        error={compare}
                    />
                </div>
                <div className="edit-profile__buttons">
                    <ResetButton>Cancel</ResetButton>
                    <Button type="submit" disabled={
                        !Boolean(currentPassword && newPassword && confirmPassword)
                    }>Save</Button>
                </div>
            </form>
        </Modal>
    );
};
