import React, { FormEvent, useEffect, useRef, useState } from "react";

import Button, { ResetButton } from "../button"
import Password from "../app-input/password";
import { IUser } from "../../types/edit-profile/types";

import Modal from "../modal";
import "./styles/edit-account.scss"
import { adaptRoles } from "../../services/baseService";
import KeyIcon from './assets/key.svg';
import ComaList from '../coma-list';
import { useDispatch } from "react-redux";
import { changePassword } from "../../store/account/actions";

interface IEditProfile {
    onClose: () => void;
    user: IUser;
}

export const EditPassword: React.FunctionComponent<IEditProfile> = ({
    onClose,
    user,
}) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [wrongCurrent, setWrongCurrent] = useState<string | undefined>(
        undefined
    );
    const [compare, setCompare] = useState<string | undefined>(undefined);
    const [validateNew, setValidateNew] = useState<boolean>(false);

    const dispatch = useDispatch();
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
        if (formRef.current?.checkValidity() && !compare) {

            dispatch(changePassword({
                currentPassword,
                newPassword
            }, onClose, setWrongCurrent))
        }
    };

    return (
        <Modal onClose={onClose} className="edit-account" headline="My Account">
            <dl className="edit-account__list">
                <div className="edit-account__row">
                    <dt className="edit-account__name">
                        Name
                    </dt>
                    <dd className="edit-account__value">
                        {user.firstName}
                    </dd>
                </div>
                <div className="edit-account__row">
                    <dt className="edit-account__name">
                        Surname
                    </dt>
                    <dd className="edit-account__value">
                        {user.lastName}
                    </dd>
                </div>
                <div className="edit-account__row">
                    <dt className="edit-account__name">
                        Organization
                    </dt>
                    <dd className="edit-account__value">
                        {user.companyName}
                    </dd>
                </div>
                <div className="edit-account__row">
                    <dt className="edit-account__name">
                        Organization Role
                    </dt>

                    <dd className="edit-account__value">
                        <ComaList list={adaptRoles(user.userRoles)} />
                    </dd>

                </div>
                <div className="edit-account__row">
                    <dt className="edit-account__name">
                        Email
                    </dt>
                    <dd className="edit-account__value">
                        {user.email}
                    </dd>
                </div>
                <div className="edit-account__row">
                    <dt className="edit-account__name">
                        Expiration Date
                    </dt>
                    <dd className="edit-account__value">
                        {user.subscriptionEndDate.split(' ')[0]}
                    </dd>
                </div>
                {!showEditForm && (
                    <div className="edit-account__row edit-account__row--inactive">
                        <dt className="edit-account__name">
                            Current Password
                        </dt>
                        <dd className="edit-account__value">
                            <button
                                type='button' className="edit-account__button"
                                onClick={() => setShowEditForm(true)}
                            >
                                change
                                <KeyIcon aria-hidden="true" fill="currentColor" />
                            </button>
                        </dd>
                    </div>)
                }
            </dl>
            {showEditForm && (
                <form
                    id='edit-pass-form'
                    action=""
                    className="edit-account__form edit-account__form--pass"
                    onSubmit={handlerSubmit}
                    onReset={onClose}
                    ref={formRef}
                >
                    <button
                        type='button' className="edit-account__button edit-account__button--cancel"
                        onClick={() => setShowEditForm(false)}
                    >
                        cancel
                    </button>
                    <Password
                        placeholder="Current Password"
                        value={currentPassword}
                        externalSetter={setCurrentPassword}
                        name="password"
                        autoComplete="current-password"
                        error={wrongCurrent}
                    />

                    <Password
                        autoComplete="new-password"
                        value={newPassword}
                        externalSetter={setNewPassword}
                        placeholder="New Password"
                    />
                    <Password
                        autoComplete="new-password"
                        value={confirmPassword}
                        externalSetter={setConfirmPassword}
                        placeholder="Confirm New Password"
                        error={validateNew ? compare : undefined}
                    />
                </form>
            )}

            <footer className="edit-account__footer">
                <ResetButton onClick={onClose}>Cancel</ResetButton>
                <Button
                    type="submit"
                    disabled={!Boolean(currentPassword && newPassword && confirmPassword)}
                    form="edit-pass-form"
                >
                    Save
                </Button>
            </footer>
        </Modal>
    );
};
