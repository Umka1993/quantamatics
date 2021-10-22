import React, {useState, useCallback} from "react";
import "./styles/createOrganization.scss"
import {Input} from "../input";
import { useHistory } from "react-router-dom";
import {Button} from "../button/button";
import {network} from "../../services/networkService";
import {useDispatch} from "react-redux";
import {changeRoute} from "../../store/currentPage/actions";

interface ICreateOrganization {
}

export const CreateOrganization: React.FunctionComponent<ICreateOrganization> = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [organizationName, setOrganizationName] = useState<string>('')
    const [customerID, setCustomerID] = useState<string>('')
    const [customerLink, setCustomerLink] = useState<string>('')
    const [comment, setComment] = useState<string | undefined>('')

    const createOrganization = useCallback(() => {
        if (organizationName) {
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
                    dispatch(changeRoute("/apps/organizations/list"))
                    history.push("/apps/organizations/list");
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
            <form className="create-organization__form" onSubmit={(e) => {e.preventDefault(); createOrganization()}}>
                <div className='create-organization__title'>Creating an Organization</div>
                <div className='create-organization__subtitle'>Create an organization for the future admin</div>
                <Input
                    className='create-organization__first-input'
                    onChangeInput={(value)=>setOrganizationName(value)}
                    placeholder='Organization Name'
                    value={organizationName}
                    required
                    limit={32}
                />
                <Input
                    onChangeInput={(value)=>setCustomerID(value)}
                    placeholder='CRM Customer ID'
                    value={customerID}
                    limit={32}
                />
                <Input
                    onChangeInput={(value)=>setCustomerLink(value)}
                    placeholder='CRM Customer ID Link'
                    value={customerLink}
                    limit={32}
                />
                <Input
                    onChangeInput={(value)=>setComment(value)}
                    limit={200}
                    placeholder='Comments'
                    value={comment}
                />
                <div className='create-organization__submit' >
                    <Button type={'simple'} text={'Save'} htmlType='submit' />
                </div>
                <div className='create-organization__cancel'>
                    <Button type={'dotted'} text={'Cancel'} onClick={() => cancelCreate()}/>
                </div>
            </form>
        </div>
    )
}

