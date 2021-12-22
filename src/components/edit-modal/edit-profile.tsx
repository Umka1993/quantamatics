import React, { FormEvent, useEffect, useRef, useState, FunctionComponent } from "react";

import Button, { ResetButton } from "../button";
import AppInput, { DatePick, Email } from "../app-input";
import { SelectorInput } from "../selector-input";
import Modal from "../modal";
import RoleCheckboxes from "../role-checkboxes";
import { OrganizationKey, UserRole } from "../../data/enum";
import { useDispatch } from "react-redux";
import { IUpdateUser } from "../../types/user";
import { useUpdateUserMutation, useUpdateUserRolesMutation } from "../../api/user";
import { useGetAllOrganizationsQuery } from "../../api/organization";
import IApiError from "../../types/api-error";
import useUser from "../../hooks/useUser";
import { login } from "../../store/authorization";
import Loader from "../loader";

import "./styles/edit-account.scss";
interface IEditProfile {
    onClose: () => void;
    user: IUpdateUser;
}

export const EditProfile: FunctionComponent<IEditProfile> = ({
    onClose,
    user,
}) => {
    const [firstName, setName] = useState<string>(user.firstName);
    const [lastName, setSurname] = useState<string>(user.lastName);
    const [companyName, setOrganization] = useState<string>(user.companyName);
    const [email, setEmail] = useState<string>(user.email);
    const [subscriptionEndDate, setExpiration] = useState<Date>(user.subscriptionEndDate);

    const [emailError, setEmailError] = useState<string | undefined>(undefined);
    const [validate, setValidate] = useState<boolean>(false);
    const [userRoles, setRoles] = useState<UserRole[]>(user.userRoles)
    // const [organizationId, setOrganizationId] = useState<string>('')
    const dispatch = useDispatch()

    const formRef = useRef<HTMLFormElement>(null);

    const loggedUser = useUser();

    const [update, { isSuccess, isError, error, isLoading }] = useUpdateUserMutation();
    const [updateRoles, { isSuccess: isFinish, isLoading: secondLoading }] = useUpdateUserRolesMutation();

    const { data: allOrganizations } = useGetAllOrganizationsQuery();

    const sendNewUser = (validate: any) => {
        const newUserData: IUpdateUser = {
            ...user,
            firstName, lastName, companyName,
            subscriptionEndDate, userRoles,
        };
        if (email !== user.email) {
            newUserData.newEmail = email;
        }
        update(newUserData).unwrap();
    };

    const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setValidate(true);

        const isValid = formRef.current?.reportValidity();

        if (isValid) {
            sendNewUser(validate);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            updateRoles([user.id, userRoles])

            if (user.id === loggedUser?.id) {
                const normalizedNewData = {
                    ...loggedUser,
                    firstName, lastName, companyName, email,
                    subscriptionEndDate: subscriptionEndDate.toLocaleDateString(),
                    userRoles
                };
                dispatch(login(normalizedNewData));

                localStorage.setItem("user", JSON.stringify(normalizedNewData));
            }

        }
    }, [isSuccess])

    useEffect(() => {
        isFinish && onClose();
    }, [isFinish])

    useEffect(() => {
        if (isError) {
            (error as IApiError).data.includes(" already taken")
                && setEmailError("The user with such email already exists")
        }
    }, [isError])


    useEffect(() => {
        emailError && setEmailError(undefined);
    }, [email]);

    useEffect(() => {
        emailError && formRef.current?.reportValidity();
    }, [emailError]);

    return (
        <Modal onClose={onClose} className="edit-account" headline="Edit User Account">
            {(isLoading || secondLoading) ? <Loader />
                :
                <>
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
                            value={firstName}
                            name="firstName"
                            icon="edit"
                            label='First Name'
                            maxLength={100}
                            required
                        />
                        <AppInput
                            externalSetter={setSurname}
                            value={lastName}
                            name="lastName"
                            icon="edit"
                            label='Last Name'
                            maxLength={100}
                            required
                        />


                        <Email
                            externalSetter={setEmail}
                            value={email}
                            error={emailError}
                            icon="edit"
                            label='Email'
                            maxLength={100}
                            required
                        />
                        <DatePick
                            externalSetter={setExpiration}
                            valueAsDate={subscriptionEndDate}
                            label='Expiration Date'
                            required
                        />
                        {allOrganizations &&
                            <SelectorInput
                                options={allOrganizations?.map(org => org[OrganizationKey.Name]) as string[]}
                                // valueSetter={setOrganizationId}
                                optionSetter={setOrganization}
                                // values={allOrganizations?.map(({id}) => id) as string[]}
                                value={companyName}
                                label='Organization'
                                disabled
                            />}
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
                </>
            }
        </Modal>
    );
};
