import React, { useEffect, useState } from "react";
import Button, { ResetButton } from "../button";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "../../data/enum";

import style from "./restart-server.module.scss";
import { useRestartServerMutation } from "../../api/account";
import Loader from "../loader";

interface IRestartServer {
    onClose: () => void;
}

export const RestartServer: React.FunctionComponent<IRestartServer> = ({ onClose }) => {
    const navigate = useNavigate();
    const [restartServer, { isSuccess, isError, error, isLoading: isRestarting }] = useRestartServerMutation();

    useEffect(() => {
        if (isSuccess) {
            navigate(AppRoute.Home);
            onClose();
        }
    }, [isSuccess]);

    return isRestarting ? (
        <>
            <p>Your server is restarting, you will be redirect automatically</p>
            <div className={style.loader}>
                <Loader />
            </div>
        </>
    ) : (
        <>
            <p><strong>Warning! This will restart your server.</strong></p>
            <p><i>All unsaved work will be lost.</i></p>

            <footer className={style.footer}>
                <ResetButton onClick={onClose}>Cancel</ResetButton>
                <Button
                    type="button"
                    onClick={restartServer as () => void}
                    variant='danger'
                >
                    Restart
                </Button>
            </footer>
        </>
    )
};
