import React, { useState, useCallback } from "react";
import "./styles/create-organization.scss"
import { Input } from "../input";
import { useHistory } from "react-router-dom";
import Button, { ResetButton } from "../button";
import { network } from "../../services/networkService";
import { useDispatch } from "react-redux";
import { changeRoute } from "../../store/currentPage/actions";
import Form from './form';
import { createOrganization } from "../../store/organization/actions";

interface ICreateOrganization {
}

const CreateOrganization: React.FunctionComponent<ICreateOrganization> = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [name, setName] = useState<string>('')
    const [customerCrmId, setCustomerCrmId] = useState<string>('')
    const [customerCrmLink, setCustomerCrmLink] = useState<string>('')
    const [comments, setComments] = useState<string | undefined>('')

    const [finish, setFinish] = useState<boolean | undefined>(undefined)

    const returnBack = () => {
        dispatch(changeRoute("apps/organizations/list"))
        history.push('/apps/organizations/list')
    }


    const registerOrganization = () => dispatch(createOrganization(
        { name, customerCrmId, customerCrmLink, comments, },
        returnBack,
        () => setFinish(true)
    ))

    return (
        <Form
            className="create-organization"
            headline='Creating an Organization'
            subtitle='Create an organization for the future admin'
            onSubmit={registerOrganization}
            onReset={returnBack}
            stopLoading={finish}
        >
            <Input
                className='create-organization__first-input'
                onChangeInput={(value) => setName(value)}
                placeholder='Organization Name'
                value={name}
                required
                limit={32}
            />
            <Input
                onChangeInput={(value) => setCustomerCrmId(value)}
                placeholder='CRM Customer ID'
                value={customerCrmId}
                limit={32}
            />
            <Input
                onChangeInput={(value) => setCustomerCrmLink(value)}
                placeholder='CRM Customer ID Link'
                value={customerCrmLink}
                limit={32}
            />
            <Input
                onChangeInput={(value) => setComments(value)}
                limit={200}
                placeholder='commentss'
                value={comments}
            />
            <Button
                className='create-organization__submit'
                type='submit'
                disabled={!name}
            >
                Save
            </Button>
            <ResetButton
                className='create-organization__cancel'
            >
                Cancel
            </ResetButton>

        </Form >

    )
}

export default CreateOrganization;