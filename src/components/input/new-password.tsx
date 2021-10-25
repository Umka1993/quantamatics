import React from "react";
import { Input } from "./index";

interface INewPassword {
    password: string;
    confirm: string;
    setters: any;
    validateBoth?: boolean;
}

export const NewPassword: React.FunctionComponent<INewPassword> = ({password, confirm, setters, validateBoth }) => {

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
                enableValidation
            />
            <Input
                onChangeInput={(value) => setters[1](value)}
                type={"password"}
                placeholder="Confirm New Password"
                value={confirm}
                enableValidation={validateBoth}
            />
            {!!error && <div className="login-page__inputs-errors">{error}</div>}
        </>
    );
};
