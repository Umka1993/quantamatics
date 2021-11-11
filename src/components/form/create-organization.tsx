import React, { useState } from "react";
import "./styles/create-organization.scss"
import Input, { InputURL } from "../app-input";
import { useHistory } from "react-router-dom";
import Button, { ResetButton } from "../button";
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

    const registerOrganization = () => dispatch(
        createOrganization({ name, customerCrmId, customerCrmLink, comments },
            returnBack,
            () => setFinish(true))
    )

    return (
        <Form
            className="create-organization"
            headline='Creating an Organization'
            subtitle='Create an organization for the future admin'
            onSubmit={registerOrganization}
            onReset={returnBack}
            stopLoading={finish}
        >
            <div className="create-organization__fields">
                <Input
                    externalSetter={setName}
                    placeholder='Organization Name'
                    required
                    value={name}
                    maxLength={32}
                />

                <Input
                    externalSetter={setCustomerCrmId}
                    placeholder='CRM Customer ID'
                    value={customerCrmId}
                    // type='number'
                    // max={99999999999999999999999999999999}
                    maxLength={32}
                />

                {/* <InputURL 
                    externalSetter={setCustomerCrmLink} value={customerCrmLink}
                    placeholder='CRM Customer ID Link' maxLength={32}
                /> */}

                <Input
                    externalSetter={setCustomerCrmLink}
                    placeholder='CRM Customer ID Link'
                    value={customerCrmLink}
                    type='url'
                    maxLength={32}
                />

                <Input
                    externalSetter={setComments}
                    placeholder='Comments'
                    value={comments}
                    maxLength={200}
                />
            </div>

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