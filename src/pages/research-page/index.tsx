import React, {useRef} from "react";
import "./styles/research.scss"

export const ReSearchPage: React.FunctionComponent = (props) => {
    const HUB_URL = 'https://hub-k8s.dev.quantamatics.net/'
    const frame: any = useRef(null)
    const formAction = HUB_URL + 'hub/login'
    const token = localStorage.getItem('id_token')

    if (frame.current) {
       frame.current.addEventListener("message", (event: any) => {
            console.log(event)
            if (event.data === "Loaded") console.log('juptyer')
        });
    }

    return(
        <div>
            <form method={'post'} target="jupyter-iframe" action={formAction}>
                {
                    token ? <input name={'token'} value={token}/> : ''
                }
                <button type={"submit"}>Click</button>
            </form>
            <iframe name="jupyter-iframe" ref={frame}>

            </iframe>
        </div>
    )
}
