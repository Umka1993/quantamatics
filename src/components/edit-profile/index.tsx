import React, { FormEvent, useState } from "react";
import "./styles/edit-profile.scss"
import photoIcon from "./assets/photos.svg"
import CloseIcon from "./assets/close.svg"
import avatar from "./assets/avatar.svg"
import SVG from "../SVG";
import { Button } from "../button/button";
import { Input } from "../input";
import { IUser } from "../../types/edit-profile/types"
import { NewPassword } from '../input/new-password';
import { network } from "../../services/networkService";
import { EditProfileForm } from './edit-profile-form';

interface IEditProfile {
    onClose: () => void
    type_edit?: Boolean
    user: IUser
    onSubmit?: any
}

export const EditProfile: React.FunctionComponent<IEditProfile> = ({ onClose, type_edit, user, onSubmit }) => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const handleModalClose = () => {
        onClose()
    }

    const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {

        onClose()

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

    }

    return (
        <>
            <div className="modal-profile">
            </div>
            <div className="edit-profile modal">
                <button className="modal__close" onClick={() => handleModalClose()}>
                    <CloseIcon aria-hidden />
                </button>
                <div className="edit-profile__wrapper">
                    <div className="edit-profile__summary">
                        <div className="edit-profile__summary-container">
                            <div className="avatar">
                                <div className="avatar__img">
                                    <SVG icon={avatar} />
                                </div>
                                <div className="avatar__upload">
                                    <div className="avatar__upload-text">Upload New</div>
                                    <SVG icon={photoIcon} />
                                </div>
                            </div>
                            <div className="details">
                                <div className="details__item">
                                    <span>Name</span>
                                    <span>{user.firstName}</span>
                                </div>
                                <div className="details__item">
                                    <span>Surname</span>
                                    <span>{user.lastName}</span>
                                </div>
                                <div className="details__item">
                                    <span>Organization</span>
                                    <span>{user.companyName}</span>
                                </div>
                                <div className="details__item">
                                    <span>Email</span>
                                    <span>{user.email}</span>
                                </div>
                                <div className="details__item">
                                    <span>Expiration Date</span>
                                    <span>{user.subscriptionEndDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {
                        type_edit ?
                            <EditProfileForm user={user} resetFunction={handleModalClose} 
                                submitFunction={onSubmit} 
                            />
                            :
                            <form className="edit-profile__fields" onSubmit={handlerSubmit}>
                                <div className="edit-profile__fields-container">
                                    <div className="edit-profile__title">Change Password</div>

                                    <div>
                                        <Input onChangeInput={(value) => setCurrentPassword(value)}
                                            value={currentPassword}
                                            placeholder={'Current Password'}
                                            type={'password'} />

                                        <NewPassword
                                            password={newPassword} confirm={confirmPassword}
                                            setters={[setNewPassword, setConfirmPassword]}
                                            validateBoth
                                        />
                                    </div>
                                    <div className="edit-profile__buttons">
                                        <div className="edit-profile__cancel-btn" onClick={() => handleModalClose()}>
                                            <Button type={'dotted'} text={'Cancel'} />
                                        </div>
                                        <div className="edit-profile__save-btn">
                                            <Button type={'simple'} text={'Save'} htmlType='submit' />
                                        </div>
                                    </div>
                                </div>
                            </form>
                    }
                </div>
            </div>
        </>
    )
}
