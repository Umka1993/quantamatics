import React, { useState, useCallback, useEffect } from "react";
import "./styles/create-organization.scss"
import { Input } from "../input";
import { useHistory, useParams } from "react-router-dom";
import Button, { ResetButton } from "../button";
import { DatePick, Email } from "../app-input/";
import { useDispatch } from "react-redux";
import { changeRoute } from "../../store/currentPage/actions";
import Form from './form';
import { fetchOrganization } from "../../store/organization/actions";
import { registerUser } from "../../store/account/actions";

interface ICreateOrganization {
}

const CreateOrganization: React.FunctionComponent<ICreateOrganization> = (props) => {
    const { id : organizationId } = useParams<{ id: string }>();

    const [companyName, setCompanyName] = useState<string>('')

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date>(new Date());

    const [errors, setErrors] = useState<string | boolean>(false);

    const [finish, setFinish] = useState<boolean | undefined>(undefined);

    const history = useHistory();
    const dispatch = useDispatch();

    const getOrgName = (data: any) => {
        dispatch(changeRoute(`organizations/${data.name}/add-user`))
        setCompanyName(data.name)
    }

    useEffect(() => {
        dispatch(fetchOrganization(organizationId, getOrgName))
    }, [organizationId])

    const onFinish = () => history.push('/success-invitation')

    const onError = (data: any) => {
        setFinish(true)
        console.log("is wrong", data);

        if (data.errors) {
            data.errors.Email && setErrors('This is not a valid e-mail address.')

        }

        if (data[0]) {
            const { code } = data[0];

            if (code === "DuplicatefirstName") {
                setErrors("The user with such email already exists");
            }
        }
    }


    const addUserToOrg = useCallback(() => {
        dispatch(registerUser({firstName, lastName, email, organizationId, companyName, subscriptionEndDate,
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
            <Input
                onChangeInput={(value) => setFirstName(value)}
                placeholder="Name"
                required
                value={firstName}
            />
            <Input
                onChangeInput={(value) => setLastName(value)}
                placeholder="Last name"
                required
                value={lastName}
            />
            <Input
                onChangeInput={(value) => { errors && setErrors(false); setEmail(value) }}
                placeholder="Email Address"
                required
                value={email}
                errors={errors as boolean}
            />
            {errors && <p className="login-page__inputs-errors">{errors}</p>}
            <DatePick
                className='edit-profile__temp-input'
                externalSetter={setSubscriptionEndDate}
                valueAsDate={subscriptionEndDate}
                minDate={new Date}
                required
            />
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