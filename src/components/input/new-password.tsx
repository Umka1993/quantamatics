import React, { useEffect, useState } from "react";
import { Input } from "./index";

interface INewPassword {
    password: string;
    confirm: string;
    setters: any;
    validateBoth?: boolean;
    validate?: boolean;
    onInvalid?: any;
}

export const NewPassword: React.FunctionComponent<INewPassword> = ({
    password,
    confirm,
    setters,
    validateBoth,
    validate = false,
    onInvalid
}) => {
    const [passwordCompare, setPasswordCompare] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        if (password.length && confirm.length && password !== confirm) {
            setPasswordCompare("The passwords do not match");
        } else setPasswordCompare(undefined);
    }, [password, confirm, passwordCompare]);
    return (
        <>
            <Input
                onChangeInput={(value) => setters[0](value)}
                type={"password"}
                placeholder="New Password"
                value={password}
                enableValidation={validate}
                onInvalid={onInvalid}
            />
            <Input
                onChangeInput={(value) => setters[1](value)}
                type={"password"}
                placeholder="Confirm New Password"
                value={confirm}
                enableValidation={validate && validateBoth}
                errorText={validate ? passwordCompare : undefined}
                onInvalid={onInvalid}
            />
        </>
    );
};
