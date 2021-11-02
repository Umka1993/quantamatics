import React, {useRef, useEffect, useState} from "react";
import "./styles/jupyter-frame.scss"
import {useSelector} from "react-redux";
import {RootState} from "../../store";

interface JupyterFrameProps {
    type: string
}

export const JupyterFrame: React.FunctionComponent<JupyterFrameProps> = (props) => {
    const {type} = props;
    const user = useSelector<RootState>((state) => state.user.user.email)
    const username: any = !!user ? user : ''
    const filesUrl = process.env.HUB_URL + 'user/' + username +'/tree?'
    const coherenceUrl = process.env.HUB_URL +'user/' + username +'/'
    const HUB_URL = type === 'files' ? filesUrl : coherenceUrl
    const frame: any = useRef(null)
    const formAction = process.env.HUB_URL + 'hub/login'
    const token = localStorage.getItem('id_token')

    const submit: any = useRef(null);

    useEffect(() => {
        if (submit){
            submit.current.click()
        }
    });

    return(
        <div className="jupyter-frame">
            <form method={'post'} target="jupyter-iframe" action={formAction} hidden>
                {
                    token ? <input name={'token'} value={token} readOnly/> : ''
                }
                <button type={"submit"} ref={submit}>Click</button>
            </form>
            <iframe name="jupyter-iframe" ref={frame} src={HUB_URL}>

            </iframe>
        </div>
    )
}
