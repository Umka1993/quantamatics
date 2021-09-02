import React, {ReactNode, useEffect} from "react";
import "./styles/modal.scss"
import classNames from "classnames";


interface IModal {
    className?: string,
    children: ReactNode,
    onClose: () => void,
    width?: number
}

export const Modal: React.FunctionComponent<IModal> = (props) => {
    const {children, onClose, width, className} = props;
    const modalClassNames = classNames('modal', className)

    return(
        <div className={modalClassNames}>
            <div className="modal__inner" style={{width: `${width}px`}}>
                {children}
                <div className='cancel-button'><span onClick={() => onClose()}>Cancel</span></div>
            </div>
        </div>
    )
}