import React, { FunctionComponent, useEffect, useRef } from "react";
import style from "./styles/jupyter-frame.module.scss"
import Headline from "../../components/page-title/index";
import useUser from "../../hooks/useUser";
import { getToken } from "../../services/token";
import { logoutFromJupiter } from "../../services/logoutFromJupiter";

interface JupyterFrameProps {
    type: 'coherence' | 'files',
}

export const JupyterFrame: FunctionComponent<JupyterFrameProps> = ({ type }) => {
    const user = useUser();
    const filesUrl = `${process.env.HUB_URL}user/${user?.email}/tree`;
    const coherenceUrl = `${process.env.HUB_URL}user/${user?.email}/apps/Coherence/CoherenceApp.ipynb?appmode_scroll=0`;
    const HUB_URL = type === 'files' ? filesUrl : coherenceUrl

    const frameRef = useRef<HTMLIFrameElement>(null);
    const formRef = useRef<HTMLFormElement>(null)
    const token = getToken();

    useEffect(() => {
        formRef.current && formRef.current.submit();
    }, [formRef.current])

    return (
        <div className={style.root}>
            <header className={style.header}>
                <Headline>{type === 'files' ? 'My Files' : 'Coherence'}</Headline>
                {type === 'files' && (<p>Manage and edit your files</p>)}
            </header>

            {token &&
                <form
                    method='POST'
                    target="jupyter-iframe"
                    action={`${process.env.HUB_URL}hub/login`}
                    ref={formRef}
                    hidden
                >
                    <input name='token' value={token} />
                </form>
            }

            <iframe className={style.frame} name="jupyter-iframe" src={HUB_URL} ref={frameRef} />
        </div>
    )
}
