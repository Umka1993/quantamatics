import React, {useEffect, useState} from "react";
import Button, {ResetButton} from "../button";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "../../data/enum";

import Modal from "../modal";
import "./styles/restart-server.scss";
import {useRestartServerMutation} from "../../api/account";
import Loader from "../loader";

interface IRestartServer {
    onClose: () => void;
}

export const RestartServer: React.FunctionComponent<IRestartServer> = ({onClose}) => {
    const navigate = useNavigate();
    const [restarting, setRestarting] = useState(false);
    const [restartServer, {isSuccess, isError, error, isLoading}] = useRestartServerMutation();

    useEffect(() => {
        if (isSuccess) {
            navigate(AppRoute.Home);
            onClose();
        }
    }, [isSuccess]);

    useEffect(() => {
        isLoading && setRestarting(true);
    }, [isLoading]);

    return (
        <Modal onClose={onClose} className="restart-server" headline="Restart Server">
            {restarting ? (
                <>
                    <p>Your server is restarting, you will be redirect automatically</p>
                    <div className="loader">
                        <Loader/>
                    </div>
                </>
            ) : (
                <>
                    <h4>Warning! This will restart your server.</h4>
                    <p><i>All unsaved work will be lost.</i></p>

                    <footer className="restart-server__footer">
                        <ResetButton onClick={onClose}>Cancel</ResetButton>
                        <Button
                            type="button"
                            className="btn-danger"
                            onClick={() => restartServer()}
                        >
                            Restart
                        </Button>
                    </footer>
                </>
            )}
        </Modal>
    );
};
