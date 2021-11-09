import React, {useRef, useEffect, useState} from "react";
import "./styles/jupyter-frame.scss"
import {useSelector} from "react-redux";
import {RootState} from "../../store";

export const CoherenceFrame: React.FunctionComponent = (props) => {
    const HUB_URL = process.env.HUB_URL
    const frame: any = useRef(null)
    const formAction = HUB_URL + 'hub/login'
    const token = localStorage.getItem('id_token')
    const username = useSelector<RootState>((state) => state.auth.user?.email)
    const COHERENCE_URL = HUB_URL + "user/" + username + "/apps/Coherence/CoherenceApp.ipynb?appmode_scroll=0"

    const submit: any = useRef(null);

    useEffect(() => {
        if (submit){
            submit.current.click()
        }
        frame.current.src = COHERENCE_URL
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
