import React, { useState, useCallback, useEffect } from "react";
import "./styles/create-organization.scss"
import { Input } from "../input";
import { useHistory, useParams } from "react-router-dom";
import Button, { ResetButton } from "../button";
import { network } from "../../services/networkService";
import { DatePick, Email } from "../app-input/";
import { useDispatch } from "react-redux";
import { changeRoute } from "../../store/currentPage/actions";
import Form from './form';
import { fetchOrganization } from "../../store/organization/actions";

interface ICreateOrganization {
}

const CreateOrganization: React.FunctionComponent<ICreateOrganization> = (props) => {
    const { id } = useParams<{ id: string }>();

    const [organizationName, setOrganizationName] = useState<string>('')

    const [userName, setUserName] = useState<string>("");
    const [userLastName, setUserLastName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [userExpiration, setUserExpiration] = useState<Date>(new Date());

    const [errors, setErrors] = useState<string | boolean>(false);

    const [finish, setFinish] = useState<boolean | undefined>(undefined);

    const history = useHistory();
    const dispatch = useDispatch();

    const getOrgName = (data: any) => {
        dispatch(changeRoute(`organizations/${data.name}/add-user`))
        setOrganizationName(data.name)
    }

    useEffect(() => {
        dispatch(fetchOrganization(id, getOrgName))
    }, [id])

    

    const addUserToOrg = useCallback(() => {
        network
            .post("/api/Account/register", {
                firstName: userName,
                lastName: userLastName,
                email: userEmail,
                organizationId: id,
                companyName: organizationName,
                subscriptionEndDate: userExpiration,
            })
            .then((r: any) => {
                history.push('/success-invitation')
                setFinish(true)
            })
            .catch(({ response: { data } }) => {
                setFinish(true)
                console.log("is wrong", data);

                if (data.errors) {
                    data.errors.Email && setErrors('This is not a valid e-mail address.')

                }

                if (data[0]) {
                    const { code } = data[0];

                    if (code === "DuplicateUserName") {
                        setErrors("The user with such email already exists");
                    }
                }

            });

    }, [userName, userLastName, userEmail, userExpiration]);

    return (
        <Form
            className="create-organization"
            headline='Add User Accounts'
            subtitle='Add users to your organization and manage them'
            onSubmit={addUserToOrg}
            stopLoading={finish}
        >
            <Input
                onChangeInput={(value) => setUserName(value)}
                placeholder="Name"
                required
                value={userName}
            />
            <Input
                onChangeInput={(value) => setUserLastName(value)}
                placeholder="Last name"
                required
                value={userLastName}
            />
            <Input
                onChangeInput={(value) => { errors && setErrors(false); setUserEmail(value) }}
                placeholder="Email Address"
                required
                value={userEmail}
                errors={errors as boolean}
            />
            {errors && <p className="login-page__inputs-errors">{errors}</p>}
            <DatePick
                className='edit-profile__temp-input'
                externalSetter={setUserExpiration}
                valueAsDate={userExpiration}
                minDate={new Date}
                required
            />
            <Button
                className='create-organization__submit'
                type='submit'
                disabled={
                    !Boolean(userName && userLastName && userEmail && userExpiration)
                }
            >
                Save
            </Button>

            <ResetButton
                className='create-organization__cancel'
                href={`/apps/organizations/${id}`}
            >
                Cancel
            </ResetButton>

        </Form >

    )
}

export default CreateOrganization;