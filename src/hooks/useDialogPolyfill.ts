import { useLayoutEffect, RefObject } from "react";

export interface HTMLDialogElement extends HTMLDivElement {
    open: boolean;
    showModal: () => void;
    close: () => void;
}

export default function useDialogPolyfill(ref: RefObject<HTMLDialogElement>) {
    let dialogPolyfill: any = null;

    useLayoutEffect(() => {
        if ((window as any).HTMLDialogElement === undefined) {
            if (dialogPolyfill) {
                dialogPolyfill.registerDialog(ref.current);
            } else {
                import(
                    /* webpackChunkName: "dialog-polyfill" */
                    "dialog-polyfill"
                ).then((polyfill) => {
                    polyfill.default.registerDialog(ref.current as any);
                    dialogPolyfill = polyfill.default;
                });
            }
        }
    }, [ref]);
}
