import Button, { ResetButton } from '../button';
import React, { FormEvent, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Organization } from 'types/organization/types';
import Headline from '../page-title'
import Input from '../app-input';

import style from './styles/edit-organization.module.scss'
import { useNavigate } from 'react-router-dom';
import { useUpdateOrganizationMutation } from '../../api/organization';
import Loader from "../loader";

interface EditOrganizationFormProps {
    organization?: Organization,
    isHaveAccessToOrgList?: boolean,
    externalLoad?: boolean
}

const EditOrganizationForm: FunctionComponent<EditOrganizationFormProps> = ({ organization, isHaveAccessToOrgList, externalLoad }) => {

    const navigate = useNavigate();
    const [update, { isSuccess: isUpdated, isLoading: isUpdating }] =
        useUpdateOrganizationMutation();

    const [organizationName, setOrganizationName] = useState<string>("");
    const [customerID, setCustomerID] = useState<string>("");
    const [customerLink, setCustomerLink] = useState<string>("");
    const [comment, setComment] = useState<string | undefined>("");

    const setInitialOrg = useCallback(() => {
        if (organization) {
            setOrganizationName(organization.name);
            setCustomerID(organization.customerCrmId);
            setCustomerLink(organization.customerCrmLink);
            setComment(organization.comments);
        }
    }, [organization]);

    useEffect(() => {
        organization && setInitialOrg();
    }, [organization]);


    function submitHandler(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        update({
            ...organization,
            name: organizationName,
            customerCrmId: customerID,
            customerCrmLink: customerLink,
            comments: comment
        });
    }



    const resetHandler = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setInitialOrg();

        if (isHaveAccessToOrgList) {
            navigate("/apps/organizations/list");
        }
    }

    useEffect(() => {
        isUpdated && isHaveAccessToOrgList && navigate("/apps/organizations/list");
    }, [isUpdated]);

    return (<form className={style.root}
        onSubmit={submitHandler}
        onReset={resetHandler}
    >
        <header className={style.header}>
            <Headline className="edit-organization__title" style={{ margin: 0 }}>
                Edit Organization
            </Headline>
            <div className={style.buttons}>
                <ResetButton
                    onClick={
                        ({ target }) => (target as HTMLButtonElement).blur()
                    }
                >
                    Cancel
                </ResetButton>

                <Button
                    type="submit"
                    className={style.save}
                    disabled={isUpdating || externalLoad}
                >
                    Save
                </Button>
            </div>
        </header>

        {(isUpdating || externalLoad) ? <Loader /> : <>
            <Input
                externalSetter={setOrganizationName}
                value={organizationName}
                label='Org. Name'
                maxLength={64}
                required
                className={style.input}
            />
            <Input
                externalSetter={setCustomerID}
                value={customerID}
                label='CRM Customer ID'
                maxLength={32}
                className={style.input}
            />

            <Input
                externalSetter={setCustomerLink}
                value={customerLink}
                label='CRM Customer ID Link'
                maxLength={64}
                className={style.input}
            />

            <Input
                externalSetter={setComment}
                value={comment}
                placeholder="Comments"
                label='Comments'
                maxLength={200}
                showLimit
                className={style.input}
            />
        </>}


    </form>);
}

export default EditOrganizationForm;