import React, { useCallback, useState } from "react";
import "./styles/add-user-account.scss"
import { Input } from "../input";
import { Button } from "../button/button";
import SVG from "../SVG";
import { DateInput } from "../date-input";
import { network } from "../../services/networkService";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Loader } from "../loader";
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
                .catch((e) => {
                    console.log(e)
                })
        } else {
        }

    }, [userName, userLastName, userEmail, userExpiration])


    return (
        <div className="add-user-account">
            <form className="add-user-account__form" 
                onSubmit={(e) => { e.preventDefault(); addUserToOrg(); }}
            >
                <header className="add-user-account__header">
                    <h2>Add User Accounts</h2>
                    <p>Add users to your organization and manage them</p>
                </header>

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
                />
                <DateInput
                    onChangeInput={(value) => setUserExpiration(value)}
                    placeholder='Expiration Date'
                    required
                    value={userExpiration}
                    minDate={new Date()}
                    disablePastDate
                />

                <div className="add-user-account__form-btn-save">
                    <Button type={'simple'} text={'Save'} htmlType={"submit"} />
                </div>
                <div className="add-user-account__form-btn-cancel" onClick={props.onBack}>
                    <Button type={'dotted'} text={'Cancel'} />
                </div>
            </form>
            {true && (<div className="add-user-account__forgot-password success">
                <div className="add-user-account__container">
                    <div className='add-user-account__forgot-password-success-text'>
                        <SVG icon={successIcon} />An invitation email has been sent to the user
                    </div>
                    <div className="add-user-account__btn">
                        <Button onClick={() => {
                            setShowSuccessAdd(false)
                            history.go(0)
                        }} type={'simple'} text={'Go Back'} />
                    </div>
                </div>
            </div>)}
            {loginProcess && <Loader />}
        </div>
    )
}
