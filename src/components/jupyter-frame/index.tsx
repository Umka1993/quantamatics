import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import style from "./styles/jupyter-frame.module.scss"
import Headline from "../../components/page-title/index";
import useUser from "../../hooks/useUser";
import { getToken } from "../../services/token";

interface JupyterFrameProps {
    type: 'coherence' | 'files',
}

export const JupyterFrame: FunctionComponent<JupyterFrameProps> = ({ type }) => {
    const user = useUser();

    const BASE_USER_URL = `${process.env.HUB_URL}user/${user?.email}`
    const FILES_URL = `${BASE_USER_URL}/tree`;
    /**   
     * ? use notebook link because "/apps/Coherence/CoherenceApp.ipynb?appmode_scroll=0" don't work on Dev hubspot. Should be double checked on stage
    */
    const COHERENCE_URL = `${BASE_USER_URL}/notebooks/Coherence/CoherenceApp.ipynb?appmode_scroll=0`;
    const HUB_URL = type === 'files' ? FILES_URL : COHERENCE_URL;

    const frameRef = useRef<HTMLIFrameElement>(null);
    const formRef = useRef<HTMLFormElement>(null)
    const token = getToken();

    
    useEffect(() => {
        /**   
         * * submit form on every component's mount will reset COHERENCE link
         * That why we need to store the logged state 
        */
        if (!localStorage.getItem('jupiter-logged')) {
            formRef.current && formRef.current.submit();
            localStorage.setItem('jupiter-logged', 'true')
        }
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