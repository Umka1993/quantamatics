import React, {useCallback, useState} from "react";
import "./styles/add-user-account.scss"
import {Input} from "../input";
import {Button} from "../button/button";
import arrowIcon from "./assets/arrow.svg"
import SVG from "../SVG";
import {DateInput} from "../date-input";
import {network} from "../../services/networkService";
import {changeRoute} from "../../store/currentPage/actions";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {Loader} from "../loader";
import successIcon from "../../pages/add-user-page/assets/sucess-icon.svg";

interface IAddUserAccount {
    onBack: () => void
    orgId: string
}


export const AddUserAccount: React.FunctionComponent<IAddUserAccount> = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [loginProcess, setLoginProcess] = useState<boolean>(false)
    const [userName, setUserName] = useState<string>('')
    const [userLastName, setUserLastName] = useState<string>('')
    const [userEmail, setUserEmail] = useState<string>('')
    const [userExpiration, setUserExpiration] = useState<any>(null)
    const [showSuccessAdd, setShowSuccessAdd] = useState<boolean>(false)

    const [errors, setErrors] = useState<string | boolean>(false);

    const addUserToOrg = useCallback(() => {
        if (userName && userLastName && userEmail && userExpiration) {
            setLoginProcess(true)
            network.post('/api/Account/register', {
                firstName: userName,
                lastName: userLastName,
                email: userEmail,
                organizationId: props.orgId,
                subscriptionEndDate: new Date(userExpiration)
            })
                .then((r: any) => {
                    setLoginProcess(false)
                    setShowSuccessAdd(true)
                })
                .catch(({response : {data}}) => {
                    const {code} = data[0]
                    setLoginProcess(false)
                    if (code === 'DuplicateUserName') {
                        setErrors('The user with such email already exists')
                    }
                })
        } else {
        }

    }, [userName, userLastName, userEmail, userExpiration])


    return (
        <div className="add-user-account">
            <div className="add-user-account__form">
                <h2>Add User Accounts</h2>
                <Input onChangeInput={(value) => setUserName(value)}
                       placeholder="Name"
                       required
                       value={userName}
                />
                <Input onChangeInput={(value) => setUserLastName(value)}
                       placeholder="Last name"
                       required
                       value={userLastName}
                />
                <Input onChangeInput={(value) => setUserEmail(value)}
                       placeholder="Email Address"
                       required
                       value={userEmail}
                       errors={errors as boolean}
                />
                {errors && (<p className='login-page__inputs-errors'>{errors}</p>)}
                <DateInput
                    onChangeInput={(value)=>setUserExpiration(value)}
                    placeholder='Expiration Date'
                    required
                    value={userExpiration}
                />

                <div className="add-user-account__form-btn-save" onClick={() => addUserToOrg()}>
                    <Button type={'simple'} text={'Save'}/>
                </div>
                <div className="add-user-account__form-btn-cancel" onClick={props.onBack}>
                    <Button type={'dotted'} text={'Cancel'}/>
                </div>
            </div>
            {showSuccessAdd && (<div className="add-user-account__forgot-password success">
                <div className="add-user-account__container">
                    <div className='add-user-account__forgot-password-success-text'>
                        <SVG icon={successIcon}/>An invitation email has been sent to the user
                    </div>
                    <div className="add-user-account__btn">
                        <Button onClick={() => {
                            setShowSuccessAdd(false)
                            dispatch(changeRoute("/apps/organizations/list"))
                            history.push("/apps/organizations/list");
                        }} type={'simple'} text={'Go Back'}/>
                    </div>
                </div>
            </div>)}
            {loginProcess && <Loader />}
        </div>
    )
}
