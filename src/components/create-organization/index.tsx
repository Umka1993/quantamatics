import React, {useState, useCallback} from "react";
import "./styles/createOrganization.scss"
import {Input} from "../input";
import { useHistory } from "react-router-dom";
import {Button} from "../button/button";
import {network} from "../../services/networkService";

interface ICreateOrganization {
}

export const CreateOrganization: React.FunctionComponent<ICreateOrganization> = (props) => {
    const history = useHistory();

    const [organizationName, setOrganizationName] = useState<string>('')
    const [customerID, setCustomerID] = useState<string>('')
    const [customerLink, setCustomerLink] = useState<string>('')
    const [comment, setComment] = useState<string | undefined>('')

    const createOrganization = useCallback(() => {
        if (organizationName && customerID && customerLink) {
            network.post('api/Organization/create', {
                name: organizationName,
                customerCrmId: customerID,
                customerCrmLink: customerLink,
                comments: comment,
            })
                .then((r: any) => {
                    console.log(r)
                    setOrganizationName('')
                    setCustomerID('')
                    setCustomerLink('')
                    setComment('')
                    history.push("/organization");
                })
                .catch((e) => {
                    console.log(e)
                })
        } else {
        }

    }, [organizationName, customerID, customerLink, comment])

    const cancelCreate = useCallback(() => {
        setOrganizationName('')
        setCustomerID('')
        setCustomerLink('')
        setComment('')
        history.push('/apps/organizations/list')
    }, [organizationName, customerID, customerLink, comment])

    return(
        <div className="create-organization">
            <div className="create-organization__form">
                <div className='create-organization__title'>Creating an Organization</div>
                <div className='create-organization__subtitle'>Create an organization for the future admin</div>
                <Input
                    className='create-organization__first-input'
                    onChangeInput={(value)=>setOrganizationName(value)}
                    placeholder='Organization Name'
                    value={organizationName}
                />
                <Input
                    onChangeInput={(value)=>setCustomerID(value)}
                    placeholder='CRM Customer ID'
                    value={customerID}
                />
                <Input
                    onChangeInput={(value)=>setCustomerLink(value)}
                    placeholder='CRM Customer ID Link'
                    value={customerLink}
                />
                <Input
                    onChangeInput={(value)=>setComment(value)}
                    limit={'200'}
                    placeholder='Comments'
                    value={comment}
                />
                <div className='create-organization__submit' onClick={() => createOrganization()}>
                    <Button type={'simple'} text={'Save'}/>
                </div>
                <div className='create-organization__cancel'>
                    <Button type={'dotted'} text={'Cancel'} onClick={() => cancelCreate()}/>
                </div>
            </div>
        </div>
    )
}

