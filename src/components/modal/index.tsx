import React, {ReactNode, useEffect} from "react";
import "./styles/modal.scss"


interface IModal {
    className?: string,
    children: ReactNode,
    onClose: () => void,
}

export const Modal: React.FunctionComponent<IModal> = (props) => {
    const {children, onClose} = props;

    return(
        <div className="modal">
            <div className="modal__inner">
                {children}
                <div className='cancel-button' onClick={() => onClose()}>Cancel</div>
            </div>
        </div>
    )
}