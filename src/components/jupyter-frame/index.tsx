import React, { FunctionComponent } from "react";
import style from "./styles/jupyter-frame.module.scss"
import Headline from "../../components/page-title/index";
import useUser from "../../hooks/useUser";

interface JupyterFrameProps {
    type: 'coherence' | 'files',
}

export const JupyterFrame: FunctionComponent<JupyterFrameProps> = ({ type }) => {
    const user = useUser();
    const filesUrl = `${process.env.HUB_URL}user/${user?.email}/tree`;
    const coherenceUrl = `${filesUrl}/Coherence`;
    const HUB_URL = type === 'files' ? filesUrl : coherenceUrl

    return (
        <>
            <header className={style.header}>
                <Headline>{type === 'files' ? 'My Files' : 'Coherence'}</Headline>
                {type === 'files' && (<p>Manage and edit your files</p>)}
            </header>
            <iframe className={style.frame} name="jupyter-iframe" src={HUB_URL} />
        </>
    )
}
