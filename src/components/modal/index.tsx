import React, {
    KeyboardEventHandler,
    ReactNode,
    useEffect,
    useRef,
} from "react";
import "./styles/modal.scss";
import classNames from "classnames";
import CloseIcon from "./assets/close.svg";
import Headline from "../page-title/index";

import dialogPolyfill from "dialog-polyfill";

interface DialogElement extends HTMLDivElement {
    open: boolean,
    showModal: () => void,
}
interface IModal {
    className?: string;
    children: ReactNode;
    headline?: string;
    onClose: () => void;
}

export const Modal: React.FunctionComponent<IModal> = ({
    children,
    onClose,
    className,
    headline,
}) => {
    const modalRef = useRef<DialogElement>(null);

    const enum Hint {
        close = 'Close modal',
    }

    useEffect(() => {
        modalRef.current?.focus();
    }, []);

    useEffect(() => {
        console.log(modalRef.current)
        if (modalRef.current) {
            dialogPolyfill.registerDialog(modalRef.current);

            !modalRef.current.open && modalRef.current.showModal();
        }
    }, [modalRef.current]);


    const closeOnEsc: KeyboardEventHandler<HTMLDivElement> = ({ key }) => {
        (key === "Escape" || key === "Esc") && onClose();
    };

    return (

        <dialog
            role="dialog"
            aria-modal={true}
            className={classNames("modal", className)}
            tabIndex={0}
            ref={modalRef}
            aria-labelledby="modal-label"
            onKeyUp={closeOnEsc}
        >
            {headline && (
                <Headline id="modal-label" className="modal__title">
                    {headline}
                </Headline>
            )}
            <button
                aria-label={Hint.close}
                title={Hint.close}
                className="modal__close"
                onClick={onClose}
            >
                <CloseIcon aria-hidden />
            </button>
            {children}
        </dialog>

    );
};

export default Modal;
