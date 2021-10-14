import React, {useState} from "react";
import "./styles/edit-profile.scss"
import photoIcon from "./assets/photos.svg"
import closeIcon from "./assets/close.svg"
import editIcon from "./assets/edit.svg"
import avatar from "./assets/avatar.svg"
import SVG from "../SVG";
import {Button} from "../button/button";
import {Input} from "../input";
import {User} from "../../types/edit-profile/types"
import {DateInput} from "../date-input";
import {SelectorInput} from "../selector-input";
import {USER_ORGS} from "../../contstans/constans";

interface IEditProfile{
    onClose: () => void
    type_edit?: Boolean
    user: User
}

export const EditProfile: React.FunctionComponent<IEditProfile> = (props) => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const handleModalClose = () => {
        props.onClose()
    }

    return (
        <div>
            <div className="modal-profile">
            </div>
            <div className="edit-profile">
                <div className="edit-profile__wrapper">
                    <div className="edit-profile__summary">
                        <div className="edit-profile__summary-container">
                            <div className="avatar">
                                <div className="avatar__img">
                                    <SVG icon={avatar}/>
                                </div>
                                <div className="avatar__upload">
                                    <div className="avatar__upload-text">Upload New</div>
                                    <SVG icon={photoIcon}/>
                                </div>
                            </div>
                            <div className="details">
                                <div className="details__item">
                                    <span>Name</span>
                                    <span>{props.user.name}</span>
                                </div>
                                <div className="details__item">
                                    <span>Surname</span>
                                    <span>{props.user.surname}</span>
                                </div>
                                <div className="details__item">
                                    <span>Organization</span>
                                    <span>{props.user.organization}</span>
                                </div>
                                <div className="details__item">
                                    <span>Email</span>
                                    <span>{props.user.email}</span>
                                </div>
                                <div className="details__item">
                                    <span>Expiration Date</span>
                                    <span>{props.user.exp_date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="edit-profile__fields">
                        <div className="edit-profile__fields-container">
                            <div className="edit-profile__close" onClick={() => handleModalClose()}>
                                <SVG icon={closeIcon}/>
                            </div>
                            <div className="edit-profile__title">Change Password</div>
                            {
                                props.type_edit ?
                                    <div>
                                         <Input onChangeInput={(value => {})}
                                                value={props.user.name}
                                                icon={editIcon}
                                         />
                                        <Input onChangeInput={(value => {})}
                                               value={props.user.surname}
                                               icon={editIcon}
                                        />
                                        <SelectorInput onChangeInput={(value => {})}
                                                       options={USER_ORGS}
                                                       value={props.user.organization}
                                        />
                                        <Input onChangeInput={(value => {})}
                                               value={props.user.email}
                                               icon={editIcon}
                                        />
                                        <DateInput onChangeInput={(value => {})}/>
                                    </div>
                                    :
                                    <div>
                                        <Input onChangeInput={(value) => setCurrentPassword(value)}
                                               value={currentPassword}
                                               placeholder={'Current Password'}
                                               type={'password'}/>
                                        <Input onChangeInput={(value) => setNewPassword(value)}
                                               value={newPassword}
                                               placeholder={'New Password'}
                                               type={'password'}/>
                                        <Input onChangeInput={(value) => setConfirmPassword(value)}
                                               value={confirmPassword}
                                               placeholder={'Confirm New Password'}
                                               type={'password'}/>
                                    </div>
                            }
                            <div className="edit-profile__buttons">
                                <div className="edit-profile__cancel-btn" onClick={() => handleModalClose()}>
                                    <Button type={'dotted'} text={'Cancel'}/>
                                </div>
                                <div className="edit-profile__save-btn">
                                    <Button type={'simple'} text={'Save'}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}