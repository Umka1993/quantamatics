import React from "react";
import { Input } from "./index";

interface INewPassword {
    password: string;
    confirm: string;
    setters: any;
}

export const NewPassword: React.FunctionComponent<INewPassword> = ({password, confirm, setters }) => {

    let error = ''

    if (password !== confirm && password.length && confirm.length ) {
        error = 'The passwords do not match';
    }


    return (
        <>
            <Input
                onChangeInput={(value) => setters[0](value)}
                type={"password"}
                placeholder="New Password"
                value={password}
            />
            <Input
                onChangeInput={(value) => setters[1](value)}
                type={"password"}
                placeholder="Confirm New Password"
                value={confirm}
                disableValidation
            />
            {!!error && <div className="login-page__inputs-errors">{error}</div>}
        </>
    );
};
