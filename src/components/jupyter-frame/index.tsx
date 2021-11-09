import React, { useRef, useEffect, useState } from "react";
import "./styles/jupyter-frame.scss"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeRoute } from "../../store/currentPage/actions";
import Headline from "../../components/page-title/index";

interface JupyterFrameProps {
    type: string
}

export const JupyterFrame: React.FunctionComponent<JupyterFrameProps> = (props) => {
    const dispatch = useDispatch();

    const { type } = props;

    if (type === 'files') {
        dispatch(changeRoute('research/my-files'))
    }
    
    const user = useSelector<RootState>((state) => state.auth.user?.email)
    const username: any = !!user ? user : ''
    const filesUrl = process.env.HUB_URL + 'user/' + username +'/tree?'
    const coherenceUrl = process.env.HUB_URL +'user/' + username +'/'
    const HUB_URL = type === 'files' ? filesUrl : coherenceUrl
    const frame: any = useRef(null)
    const formAction = process.env.HUB_URL + 'hub/login'
    const token = localStorage.getItem('id_token')

    const submit: any = useRef(null);

    useEffect(() => {
        if (submit) {
            submit.current.click()
        }
    });

    return (
        <div className="jupyter-frame">
            <header className='jupyter-frame__header'>
                <Headline>{type === 'files' ? 'My Files' : 'Coherence'}</Headline>
                {type === 'files' && (<p>Manage and edit your files</p>) }
            </header>
            <form method={'post'} target="jupyter-iframe" action={formAction}>
                {
                    token ? <input name={'token'} value={token} /> : ''
                }
                <button type={"submit"} ref={submit}>Click</button>
            </form>
            <iframe name="jupyter-iframe" ref={frame} src={HUB_URL}>

            </iframe>
        </div>
    )
}
