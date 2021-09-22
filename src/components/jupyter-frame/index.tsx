import React, {useRef, useEffect, useState} from "react";
import "./styles/jupyter-frame.scss"

export const JupyterFrame: React.FunctionComponent = (props) => {
    const HUB_URL = 'https://hub-k8s.dev.quantamatics.net/user/alavrenov/tree?'
    const frame: any = useRef(null)
    const formAction = 'https://hub-k8s.dev.quantamatics.net/hub/login'
    const token = localStorage.getItem('id_token')

    const submit: any = useRef(null);

    useEffect(() => {
        if (submit){
            submit.current.click()
        }
    });

    return(
        <div className="jupyter-frame">
            <form method={'post'} target="jupyter-iframe" action={formAction}>
                {
                    token ? <input name={'token'} value={token}/> : ''
                }
                <button type={"submit"} ref={submit}>Click</button>
            </form>
            <iframe name="jupyter-iframe" ref={frame} src={HUB_URL}>

            </iframe>
        </div>
    )
}
