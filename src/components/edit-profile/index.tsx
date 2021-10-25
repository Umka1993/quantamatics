import React, { FormEvent, useState } from "react";
import "./styles/edit-profile.scss"
import photoIcon from "./assets/photos.svg"
import closeIcon from "./assets/close.svg"
import editIcon from "./assets/edit.svg"
import avatar from "./assets/avatar.svg"
import SVG from "../SVG";
import { Button } from "../button/button";
import { Input } from "../input";
import { User } from "../../types/edit-profile/types"
import { DateInput } from "../date-input";
import { SelectorInput } from "../selector-input";
import { USER_ORGS } from "../../contstans/constans";
import { NewPassword } from '../input/new-password';
import { network } from "../../services/networkService";

interface IEditProfile {
    onClose: () => void
    type_edit?: Boolean
    user: User
}

export const EditProfile: React.FunctionComponent<IEditProfile> = ({onClose, type_edit, user }) => {
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
            <div className="edit-profile">
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
                                    <span>{user.name}</span>
                                </div>
                                <div className="details__item">
                                    <span>Surname</span>
                                    <span>{user.surname}</span>
                                </div>
                                <div className="details__item">
                                    <span>Organization</span>
                                    <span>{user.organization}</span>
                                </div>
                                <div className="details__item">
                                    <span>Email</span>
                                    <span>{user.email}</span>
                                </div>
                                <div className="details__item">
                                    <span>Expiration Date</span>
                                    <span>{user.exp_date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form className="edit-profile__fields" onSubmit={handlerSubmit}>
                        <div className="edit-profile__fields-container">
                            <div className="edit-profile__close" onClick={() => handleModalClose()}>
                                <SVG icon={closeIcon} />
                            </div>
                            {
                                type_edit ?
                                    <>
                                        <div className="edit-profile__title">Edit Profile</div>

                                        <div>
                                            <Input onChangeInput={(value => { })}
                                                value={user.name}
                                                icon={editIcon}
                                            />
                                            <Input onChangeInput={(value => { })}
                                                value={user.surname}
                                                icon={editIcon}
                                            />
                                            <SelectorInput onChangeInput={(value => { })}
                                                options={USER_ORGS}
                                                value={user.organization}
                                            />
                                            <Input onChangeInput={(value => { })}
                                                value={user.email}
                                                icon={editIcon}
                                            />
                                            <DateInput onChangeInput={(value => { })} />
                                        </div>
                                    </>
                                    :
                                    <>
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
                                    </>

                            }
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
                </div>
            </div>
        </>
    )
}
