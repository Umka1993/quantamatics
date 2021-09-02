import React, {useState, useCallback} from "react";
import "./styles/createOrganization.scss"
import {Input} from "../input";
import { useHistory } from "react-router-dom";

interface ICreateOrganization {
}

export const CreateOrganization: React.FunctionComponent<ICreateOrganization> = (props) => {
    const history = useHistory();

    const [organizationName, setOrganizationName] = useState<string>('')
    const [customerID, setCustomerID] = useState<string>('')
    const [customerLink, setCustomerLink] = useState<string>('')
    const [comment, setComment] = useState<string | undefined>('')

    const createOrganization = useCallback(() => {
        setOrganizationName('')
        setCustomerID('')
        setCustomerLink('')
        setComment('')
        history.push("/organization");
    }, [organizationName, customerID, customerLink, comment])

    const cancelCreate = useCallback(() => {
        setOrganizationName('')
        setCustomerID('')
        setCustomerLink('')
        setComment('')
    }, [organizationName, customerID, customerLink, comment])

    return(
        <div className="create-organization">
            <div className='create-organization__title'>Creating an Organization</div>
            <div className='create-organization__subtitle'>Create an organization for the future admin</div>
            <Input
                className='create-organization__first-input'
                onChangeInput={(value)=>setOrganizationName(value)}
                placeholder='Name of The Organization'
                required
                value={organizationName}
                errors
            />
            <Input
                onChangeInput={(value)=>setCustomerID(value)}
                placeholder='CRM Customer ID'
                required
                value={customerID}
            />
            <Input
                onChangeInput={(value)=>setCustomerLink(value)}
                placeholder='CRM Customer ID Link'
                required
                value={customerLink}
            />
            <Input
                onChangeInput={(value)=>setComment(value)}
                placeholder='Comments'
                value={comment}
            />
            <div className='create-organization__submit' onClick={() => createOrganization()}>save</div>
            <div className='cancel-button'><span onClick={() => cancelCreate()}>Cancel</span></div>
        </div>
    )
}

