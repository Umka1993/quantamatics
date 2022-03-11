import useDialogPolyfill, {
    HTMLDialogElement,
} from "../../hooks/useDialogPolyfill";
import React, { useEffect, useRef, HTMLProps } from "react";

import style from "./Dialog.module.scss";
import classNames from "classnames";

import CloseIcon from "./assets/close.svg";

export interface ModalProps extends HTMLProps<HTMLDivElement> {
    closeOnOutsideClick?: boolean;
    onRequestClose: () => void;
    open?: boolean;
    headline?: string;
    wrapperClass?: string;
    variant?: "default" | "right-side";
    hasCloseButton?: boolean;
}

export default function Dialog({
    closeOnOutsideClick,
    onRequestClose,
    open,
    children,
    headline,
    wrapperClass,
    id,
    variant = "default",
    hasCloseButton = true,
    ...other
}: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const lastActiveElement = useRef<Element | null>(null);
    const firstRender = useRef(true);

    useDialogPolyfill(dialogRef);

    useEffect(() => {
        // prevents calling imperative methods on mount since the polyfill will throw an error since we are not using the `open` attribute
        if (firstRender.current) {
            firstRender.current = false;
        } else {
            const dialogNode = dialogRef.current;
            if (open) {
                lastActiveElement.current = document.activeElement;
                dialogNode && dialogNode.showModal();

                document.body.classList.add("scroll-lock");
            } else {
                dialogNode && dialogNode.close();
                lastActiveElement.current && (lastActiveElement.current as any).focus();
                document.body.classList.remove("scroll-lock");
            }
        }
    }, [open]);

    useEffect(() => {
        const dialogNode = dialogRef.current;
        const handleCancel = (event: any) => {
            event.preventDefault();
            onRequestClose();
        };
        dialogNode && dialogNode.addEventListener("cancel", handleCancel);
        return () => {
            dialogNode && dialogNode.removeEventListener("cancel", handleCancel);
        };
    }, [onRequestClose]);

    function handleOutsideClick(event: any) {
        const dialogNode = dialogRef.current;
        if (closeOnOutsideClick && event.target === dialogNode) {
            onRequestClose();
        }
    }

    const closeMessage = "Close modal";
    return (
        <dialog
            ref={dialogRef}
            onClick={handleOutsideClick}
            className={[style.root, style[`root--${variant}`]].join(" ")}
            aria-labelledby={`${id}-title`}
        >
            {hasCloseButton && (
                <button
                    aria-label={closeMessage}
                    title={closeMessage}
                    className={style.close}
                    onClick={onRequestClose}
                >
                    <CloseIcon aria-hidden />
                </button>
            )}
            <div
                {...other}
                className={classNames(
                    style.wrapper,
                    style[`wrapper--${variant}`],
                    wrapperClass
                )}
            >
                {headline && (
                    <h2 id={`${id}-title`} className={style.title}>
                        {headline}
                    </h2>
                )}

                {children}
            </div>
        </dialog>
    );
}
