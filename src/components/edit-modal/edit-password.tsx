import React, { FormEvent, useRef, useState } from "react";

import { Button } from "../button/button";
import { Input } from "../input";
import { IUser } from "../../types/edit-profile/types";
import { network } from "../../services/networkService";

import { NewPassword } from "../input/new-password";
import ProfileSummary from "../profile-summary";
import Modal from "../modal";
import "./styles/edit-modal.scss";

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

    const handleModalClose = () => {
        onClose();
    };
    const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {
        onClose();

        // TODO: Need API update
        /* evt.preventDefault();
     
            if (!type_edit) {
                network.post('/api/Account/resetPassword', {
                    password: newPassword,
                    token: localStorage.getItem('id_token'),
                    email: user.email
                })
                    .then((r: any) => {
                        onClose()
                    })
                    .catch(({response : {data}}) => {
                        console.log(data)
                    })
            } */
    };

    return (
        <Modal onClose={onClose} className="edit-profile">
            <ProfileSummary user={user} className="edit-profile__summary" />
            <form
                action=""
                className="edit-profile__form"
                onSubmit={handlerSubmit}
                onReset={onClose}
            >
                <h2 id="modal-label" className="modal__title edit-profile__title">
                    Change Password
                </h2>
                <div>
                    <Input
                        onChangeInput={(value) => setCurrentPassword(value)}
                        value={currentPassword}
                        placeholder={"Current Password"}
                        type={"password"}
                    />

                    <NewPassword
                        password={newPassword}
                        confirm={confirmPassword}
                        setters={[setNewPassword, setConfirmPassword]}
                        validateBoth
                    />
                </div>

                <div className="edit-profile__buttons">
                    <Button type={"dotted"} text={"Cancel"} htmlType="reset" />

                    <Button type={"simple"} text={"Save"} htmlType="submit" />
                </div>
            </form>
        </Modal>
    );
};
