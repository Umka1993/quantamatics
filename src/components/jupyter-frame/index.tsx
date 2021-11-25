import React, { FunctionComponent } from "react";
import "./styles/jupyter-frame.scss"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeRoute } from "../../store/currentPage/actions";
import Headline from "../../components/page-title/index";
import { getToken } from "../../services/token";
import useUser from "../../hooks/useUser";

interface JupyterFrameProps {
    type: 'coherence' | 'files',
}

export const JupyterFrame: React.FunctionComponent<JupyterFrameProps> = ({ type }) => {
    const dispatch = useDispatch();

    if (type === 'files') {
        dispatch(changeRoute('research/my-files'))
    } else {
        dispatch(changeRoute('apps/coherence/my-files'))
    }

    const user = useUser();
    const filesUrl = 'https://hub-k8s.dev.quantamatics.net/user/' + user?.email + '/tree?'
    const coherenceUrl = 'https://coherence-k8s.dev.quantamatics.net/user/' + user?.email + '/'
    const HUB_URL = type === 'files' ? filesUrl : coherenceUrl

    return (
        <div className="jupyter-frame">
            <header className='jupyter-frame__header'>
                <Headline>{type === 'files' ? 'My Files' : 'Coherence'}</Headline>
                {type === 'files' && (<p>Manage and edit your files</p>)}
            </header>
            <iframe name="jupyter-iframe" src={HUB_URL}>

            </iframe>
        </div>
    )
}
