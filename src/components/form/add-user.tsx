import React, { useState, useCallback, useEffect, useRef } from "react";
import "./styles/create-organization.scss"
import { useHistory, useParams } from "react-router-dom";
import Button, { ResetButton } from "../button";
import Input, { DatePick, Email } from "../app-input/";
import { useDispatch } from "react-redux";
import { changeRoute } from "../../store/currentPage/actions";
import Form from './form';
import { fetchOrganization } from "../../store/organization/actions";
import { registerUser } from "../../store/account/actions";
import RoleCheckboxes from "../role-checkboxes"; 
import { UserRole } from "../../data/enum";

interface ICreateOrganization {
}

const CreateOrganization: React.FunctionComponent<ICreateOrganization> = (props) => {
    const { id: organizationId } = useParams<{ id: string }>();

    const [companyName, setCompanyName] = useState<string>('')

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date>(new Date());

    const [errors, setErrors] = useState<string | undefined>(undefined);

    const [finish, setFinish] = useState<boolean | undefined>(undefined);
    const [userRoles, setRoles] = useState<UserRole[]>([]);

    const formRef= useRef<HTMLFormElement>(null)

    const history = useHistory();
    const dispatch = useDispatch();

    const getOrgName = (data: any) => {
        dispatch(changeRoute(`organizations/${data.name}/add-user`))
        setCompanyName(data.name)
    }

    useEffect(() => {
        dispatch(fetchOrganization(organizationId, getOrgName))
    }, [organizationId])

    useEffect(() => {
        errors && setErrors(undefined)
    }, [email])
    useEffect(() => {
        errors && formRef.current?.reportValidity();
    } , [errors])

    const onFinish = () => history.push('/success-invitation')

    const onError = (data: any) => {
        setFinish(true)
        if (data) {
            console.log(data);
            
            const { code } = data[0];

            if (code === "DuplicateUserName") {
                setErrors("The user with such email already exists");
            }
        }
    }
    const addUserToOrg = useCallback(() => { 
        dispatch(registerUser({
            firstName, lastName, email, organizationId, companyName, subscriptionEndDate, userRoles: userRoles 
        }, onFinish, onError))

    }, [firstName, lastName, email, subscriptionEndDate]);
    

    return (
        <Form
            className="create-organization"
            headline='Add User Accounts'
            subtitle='Add users to your organization and manage them'
            onSubmit={addUserToOrg}
            stopLoading={finish}
        >
            <div className="create-organization__fields">
                <Input
                    externalSetter={setFirstName}
                    placeholder="Name"
                    required
                    value={firstName}
                />
                <Input
                    externalSetter={setLastName}
                    placeholder="Last name"
                    required
                    value={lastName}
                />
                <Email
                    externalSetter={setEmail}
                    placeholder="Email Address"
                    required
                    value={email}
                    error={errors}
                />
                {errors && <p className="login-page__inputs-errors">{errors}</p>}
                <DatePick
                    externalSetter={setSubscriptionEndDate}
                    valueAsDate={subscriptionEndDate}
                    minDate={new Date}
                    required
                />
                <RoleCheckboxes defaultRoles={userRoles} externalSetter={setRoles} />
            </div>
            <Button
                className='create-organization__submit'
                type='submit'
                disabled={
                    !Boolean(firstName && lastName && email && subscriptionEndDate)
                }
            >
                Save
            </Button>

            <ResetButton
                className='create-organization__cancel'
                href={`/apps/organizations/${organizationId}`}
            >
                Cancel
            </ResetButton>

        </Form >

    )
}

export default CreateOrganization;