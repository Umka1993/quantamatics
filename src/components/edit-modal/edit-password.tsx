import React, { FormEvent, useEffect, useRef, useState } from "react";

import { Button } from "../button/button";
import Password from "../app-input/password";
import { IUser } from "../../types/edit-profile/types";
import { network } from "../../services/networkService";

import ProfileSummary from "../profile-summary";
import Modal from "../modal";
import "./styles/edit-modal.scss";
import { AxiosError, AxiosResponse } from "axios";

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
    // const [token, setToken] = useState<string | undefined>(undefined);

    const [enableSubmit, setEnableSubmit] = useState<boolean>(false);
    const [validateNew, setValidateNew] = useState<boolean>(false);

    const formRef = useRef<HTMLFormElement>(null)


    useEffect(() => {
        wrongCurrent && setWrongCurrent(undefined);
    }, [currentPassword]);

    useEffect(() => {
        if (!!currentPassword.length && !!newPassword.length && confirmPassword) {
            setEnableSubmit(true);
        }
    }, [currentPassword, newPassword, confirmPassword]);


    useEffect(() => {
        if (!!newPassword.length && !!confirmPassword.length) {
            setCompare(
                newPassword !== confirmPassword ? "The passwords do not match" : undefined
            );
        }
    }, [newPassword, confirmPassword])

    const resetPassword = (token : string) => {
        network.post('/api/Account/resetPassword', {
            password: newPassword,
            token: token,
            email: user.email
        })
            .then((r: any) => {
                onClose()
            })
            .catch(({response } : AxiosError) => {                
                setCompare(response?.data as string)
                formRef.current?.reportValidity();
            })
    }

    const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        network
            .post("api/Account/login", {
                email: user.email,
                password: currentPassword,
            })
            .then(({data: { token} } : any) => {
                setValidateNew(true)
                if (formRef.current?.reportValidity()) {
                    localStorage.setItem('id_token', token),
                    resetPassword(token);                    
                }
            })
            .catch(({ response }: AxiosError) => {
                console.log(response);
                setWrongCurrent("Current password is incorrect");
            }); 
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
                noValidate={!validateNew}
            >
                <h2 id="modal-label" className="modal__title edit-profile__title">
                    Change Password
                </h2>
                <div className="edit-profile__temp edit-profile__inputs">
                    <Password
                        placeholder="Current Password"
                        value={currentPassword}
                        externalSetter={setCurrentPassword}
                        name="password"
                        autoComplete="current-password"
                        error={wrongCurrent}
                        triggerValidity={Boolean(wrongCurrent)}
                    />

                    <Password
                        autoComplete="new-password"
                        value={newPassword}
                        externalSetter={setNewPassword}
                        placeholder="New Password"
                        // formNoValidate={Boolean(wrongCurrent)}
                    />
                    <Password
                        autoComplete="new-password"
                        value={confirmPassword}
                        externalSetter={setConfirmPassword}
                        placeholder="Confirm New Password"
                        // formNoValidate={Boolean(wrongCurrent)}
                        error={compare}
                    />
                </div>

                <div className="edit-profile__buttons">
                    <Button type={"dotted"} text={"Cancel"} htmlType="reset" />

                    <Button 
                        type={"simple"} text={"Save"} htmlType="submit" 
                        disabled={!enableSubmit}
                    />
                </div>
            </form>
        </Modal>
    );
};
