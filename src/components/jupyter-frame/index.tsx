import React, {useRef, useEffect, useState} from "react";
import "./styles/jupyter-frame.scss"
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import { changeRoute } from "../../store/currentPage/actions";

interface JupyterFrameProps {
    type: string
}

export const JupyterFrame: React.FunctionComponent<JupyterFrameProps> = (props) => {
    const dispatch = useDispatch();

    const {type} = props;    

    if (type === 'files') {        
        dispatch(changeRoute('research/my-files'))
    }


    const user = useSelector<RootState>((state) => state.user.user.firstName)
    const username: any = !!user ? user : ''
    const filesUrl = 'https://hub-k8s.dev.quantamatics.net/user/' + username +'/tree?'
    const coherenceUrl = 'https://coherence-k8s.dev.quantamatics.net/user/' + username +'/'
    const HUB_URL = type === 'files' ? filesUrl : coherenceUrl
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
