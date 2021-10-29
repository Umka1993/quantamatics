import React, { useCallback, useState } from "react";
import "./styles/add-user-account.scss";
import { Input } from "../input";
import { Button } from "../button/button";
import SVG from "../SVG";
import DatePick from "../app-input/datepick";
import { network } from "../../services/networkService";
import { Loader } from "../loader";
import successIcon from "../../pages/add-user-page/assets/sucess-icon.svg";

interface IAddUserAccount {
    onBack: () => void;
    orgId: string;
    organization: string;
}

export const AddUserAccount: React.FunctionComponent<IAddUserAccount> = (
    props
) => {
    const [loginProcess, setLoginProcess] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    const [userLastName, setUserLastName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [userExpiration, setUserExpiration] = useState<Date>(new Date());
    const [showSuccessAdd, setShowSuccessAdd] = useState<boolean>(false);

    const [errors, setErrors] = useState<string | boolean>(false);

    const addUserToOrg = useCallback(() => {
        if (userName && userLastName && userEmail && userExpiration) {
            setLoginProcess(true);
            network
                .post("/api/Account/register", {
                    firstName: userName,
                    lastName: userLastName,
                    email: userEmail,
                    organizationId: props.orgId,
                    companyName: props.organization,
                    subscriptionEndDate: userExpiration,
                })
                .then((r: any) => {
                    console.log("is right");

                    setLoginProcess(false);
                    setShowSuccessAdd(true);
                })
                .catch(({ response: { data } }) => {
                    console.log("is wrong", data);

                    if (data.errors) {
                        data.errors.Email && setErrors('This is not a valid e-mail address.')
                        setLoginProcess(false);
                    }

                    if (data[0]) {
                        const { code } = data[0];
                        setLoginProcess(false);
                        if (code === "DuplicateUserName") {
                            setErrors("The user with such email already exists");
                        }
                    }

                });
        } else {
        }
    }, [userName, userLastName, userEmail, userExpiration]);

    return (
        <div className="add-user-account">
            <form
                className="add-user-account__form"
                onSubmit={(e) => {
                    e.preventDefault();
                    addUserToOrg();
                }}
            >
                <header className="add-user-account__header">
                    <h2>Add User Accounts</h2>
                    <p>Add users to your organization and manage them</p>
                </header>

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
                <div className="add-user-account__form-btn-save">
                    <Button
                        type={"simple"}
                        text={"Save"}
                        htmlType={"submit"}
                        disabled={
                            !Boolean(userName && userLastName && userEmail && userExpiration)
                        }
                    />
                </div>
                <div
                    className="add-user-account__form-btn-cancel"
                    onClick={props.onBack}
                >
                    <Button type={"dotted"} text={"Cancel"} />
                </div>
            </form>
            {showSuccessAdd && (
                <div className="add-user-account__forgot-password success">
                    <div className="add-user-account__container">
                        <div className="add-user-account__forgot-password-success-text">
                            <SVG icon={successIcon} />
                            An invitation email has been sent to the user
                        </div>
                        <div className="add-user-account__btn">
                            <Button
                                onClick={() => {
                                    props.onBack();
                                }}
                                type={"simple"}
                                text={"Go Back"}
                            />
                        </div>
                    </div>
                </div>
            )}
            {loginProcess && <Loader />}
        </div>
    );
};
