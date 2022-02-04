import React, { FormEvent, useEffect, useRef, useState, FunctionComponent } from "react";

import Button, { ResetButton } from "../button";
import AppInput, { DatePick, Email, Multiselect } from "../app-input";
import { SelectorInput } from "../selector-input";
import Modal from "../modal";
import RoleCheckboxes from "../role-checkboxes";
import { Error, OrganizationKey, UserRole } from "../../data/enum";
import { useDispatch } from "react-redux";
import { IUpdateUser } from "../../types/user";
import { useUpdateUserMutation, useUpdateUserRolesMutation } from "../../api/user";
import { useGetAllOrganizationsQuery } from "../../api/organization";
import IApiError from "../../types/api-error";
import useUser from "../../hooks/useUser";
import { login } from "../../store/authorization";
import Loader from "../loader";

import "./styles/edit-account.scss";
import { Organization } from "types/organization/types";
import { useGetAllAssetsQuery, useGetUserAssetsQuery, useLinkAssetToUserMutation, useUnlinkAssetToUserMutation } from "../../api/asset";
import { useParams } from "react-router-dom";
import { AssetListItem } from "../../types/asset";
interface IEditProfile {
    onClose: () => void;
    user: IUpdateUser;
}

export const EditProfile: FunctionComponent<IEditProfile> = ({
    onClose,
    user,
}) => {
    const { id: organizationID } = useParams();
    const [firstName, setName] = useState<string>(user.firstName);
    const [lastName, setSurname] = useState<string>(user.lastName);
    const [companyName, setOrganization] = useState<string>(user.companyName);
    const [email, setEmail] = useState<string>(user.email);
    const [subscriptionEndDate, setExpiration] = useState<Date>(user.subscriptionEndDate);

    const [emailError, setEmailError] = useState<string | undefined>(undefined);
    const [validate, setValidate] = useState<boolean>(false);
    const [userRoles, setRoles] = useState<UserRole[]>(user.userRoles)
    const dispatch = useDispatch()

    const formRef = useRef<HTMLFormElement>(null);

    const loggedUser = useUser();
    const { data: serverSelectedAssets, isSuccess: isAssetsLoaded } = useGetUserAssetsQuery(user.id)

    const [update, { isSuccess, isError, error, isLoading }] = useUpdateUserMutation();
    const [updateRoles, { isSuccess: isFinish, isLoading: secondLoading }] = useUpdateUserRolesMutation();

    const { data: allOrganizations } = useGetAllOrganizationsQuery();


    const { data: assets } = useGetAllAssetsQuery(
        organizationID as string
    );
    const [linkAsset] = useLinkAssetToUserMutation()
    const [unlinkAsset] = useUnlinkAssetToUserMutation()


    const [assignedAssets, setAssignedAssets] = useState<Set<string | number>>(new Set())

    const [assetError, setAssetError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [assetPrepared, setAssetPrepared] = useState(false);

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

    useEffect(() => {
        if (serverSelectedAssets && assets) {
            serverSelectedAssets.forEach(userAsset => {
                assets?.findIndex((orgAsset) => orgAsset.assetId !== userAsset.id) === -1 && unlinkAsset({ assetId: userAsset.id, userId: user.id })
            })

            const selectedAssets: Set<string | number> = new Set(serverSelectedAssets.map(({ id }) => id))

            assets?.forEach(({ assetId, sharedByDefault }) => {
                sharedByDefault && !selectedAssets.has(assetId) && linkAsset({ assetId, userId: user.id })
            })

            setAssignedAssets(selectedAssets)

            setAssetPrepared(true)
        }
    }, [serverSelectedAssets, assets])

    const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {

        evt.preventDefault();
        if (assignedAssets.size) {
            setValidate(true);
            const isValid = formRef.current?.reportValidity();
            isValid && sendNewUser(validate)
        } else {
            setAssetError(true)
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


            // ! It will be waste if we start update all users on updating org
            /*
            //? Link new assets to user
            assignedAssets.forEach((assetId) => {
                const alreadySelectedAsset = serverSelectedAssets?.find(element => element.id === assetId)

                if (alreadySelectedAsset === undefined) {
                    linkAsset({
                        assetId, userId: user.id,
                    })
                }

            })

            //? Unlink old assets from user
            serverSelectedAssets?.forEach((alreadySelectedAsset) => {
                !assignedAssets.has(alreadySelectedAsset.id) && unlinkAsset({
                    assetId: alreadySelectedAsset.id, userId: user.id
                })
            })

            */

        }
    }, [isSuccess])

    useEffect(() => {
        isFinish && onClose();
    }, [isFinish])

    useEffect(() => {
        if (isError) {
            if ((error as IApiError).data?.includes(" already taken"))
                setEmailError(Error.DuplicateUser);
            else
                alert(JSON.stringify((error as any).data?.errors));
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
                                options={allOrganizations?.map((org: Organization) => org[OrganizationKey.Name]) as string[]}
                                // valueSetter={setOrganizationId}
                                optionSetter={setOrganization}
                                // values={allOrganizations?.map(({id}) => id) as string[]}
                                value={companyName}
                                label='Organization'
                                disabled
                            />}

                        {assets && assetPrepared &&
                            <Multiselect
                                options={assets}
                                selected={assignedAssets}
                                setSelected={setAssignedAssets}
                                label="Account Assets"
                                errorMessage='Select asset permissions to assign to the user account.'
                                showError={assetError}
                                type='user'
                                inputList=
                                {[...assets.filter(({ assetId }) => assignedAssets.has(assetId))]
                                    .map(({ name }) => name)
                                    .join(", ")}
                            />

                        }

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
