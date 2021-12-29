import React, { FunctionComponent, useEffect, useRef } from "react";
import style from "./styles/jupyter-frame.module.scss"
import Headline from "../../components/page-title/index";
import useUser from "../../hooks/useUser";
import { getToken } from "../../services/token";

interface JupyterFrameProps {
    type: 'coherence' | 'files' | 'excelLibrary',
}

export const JupyterFrame: FunctionComponent<JupyterFrameProps> = ({ type }) => {
    const user = useUser();
    const BASE_USER_URL = `${process.env.HUB_URL}user/${user?.email}`
    const FILES_URL = `${BASE_USER_URL}/tree`;
    const COHERENCE_URL = `${BASE_USER_URL}/apps/Coherence/CoherenceApp.ipynb?appmode_scroll=0`;
    const EXCEL_LIB_URL = `${FILES_URL}/FacteusData/Excel%20Library`;

    const HUB_URL = type === 'files' ? FILES_URL : type === 'coherence' ? COHERENCE_URL : EXCEL_LIB_URL;

    const frameRef = useRef<HTMLIFrameElement>(null);
    const formRef = useRef<HTMLFormElement>(null)
    const token = getToken();

    useEffect(() => {
        if (!localStorage.getItem('jupiter-logged')) {
            formRef.current && formRef.current.submit();
            localStorage.setItem('jupiter-logged', 'true')

            if (type === 'coherence' && frameRef.current) {
                frameRef.current.src = HUB_URL;
            }
        }

    }, [formRef.current])

    return (
        <div className={style.root}>
            <header className={style.header}>
                <Headline>{type === 'files' ? 'My Files' : type === 'coherence' ? 'Coherence' : 'Excel Library'}</Headline>
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
                    <input
                        name='token'
                        value={token}
                        readOnly
                    />
                </form>
            }

            <iframe className={style.frame} name="jupyter-iframe" src={HUB_URL} ref={frameRef} />
        </div>
    )
}
