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

interface IAddUserAccount {
    onBack: () => void
    orgId: string
}

export const AddUserAccount: React.FunctionComponent<IAddUserAccount> = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [userName, setUserName] = useState<string>('')
    const [userLastName, setUserLastName] = useState<string>('')
    const [userEmail, setUserEmail] = useState<string>('')
    const [userExpiration, setUserExpiration] = useState<any>(null)

    const addUserToOrg = useCallback(() => {
        if (userName && userLastName && userEmail && userExpiration) {
            network.post('/api/Account/register', {
                firstName: userName,
                lastName: userLastName,
                email: userEmail,
            })
                .then((r: any) => {
                    console.log(r)
                    // dispatch(changeRoute("/apps/organizations/list"))
                    // history.push("/apps/organizations/list");
                })
                .catch((e) => {
                    console.log(e)
                })
        } else {
        }
        // if (props.orgId) {
        //     network.post('/api/Admin/updateUserOrg', {
        //     }, {
        //         params: {
        //             userId: 9,
        //             orgId: props.orgId,
        //         }})
        //         .then((r: any) => {
        //             console.log(r)
        //             // dispatch(changeRoute("/apps/organizations/list"))
        //             // history.push("/apps/organizations/list");
        //         })
        //         .catch((e) => {
        //             console.log(e)
        //         })
        // } else {
        // }

    }, [userName, userLastName, userEmail, userExpiration])


    return (
        <div className="add-user-account">
            <div className="add-user-account__form">
                <h2>Add User Accounts</h2>
                <Input onChangeInput={(value) => setUserName(value)}
                       placeholder="Name"
                       value={userName}
                />
                <Input onChangeInput={(value) => setUserLastName(value)}
                       placeholder="Last name"
                       value={userLastName}
                />
                <Input onChangeInput={(value) => setUserEmail(value)}
                       placeholder="Email Address"
                       value={userEmail}
                />
                <DateInput
                    onChangeInput={(value)=>setUserExpiration(value)}
                    placeholder='Expiration Date'
                    value={userExpiration}
                />

                <div className="add-user-account__form-btn-save" onClick={() => addUserToOrg()}>
                    <Button type={'simple'} text={'Save'}/>
                </div>
                <div className="add-user-account__form-btn-cancel" onClick={props.onBack}>
                    <Button type={'dotted'} text={'Cancel'}/>
                </div>
            </div>
        </div>
    )
}
