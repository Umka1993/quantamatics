import { useLayoutEffect, RefObject } from "react";
import { HTMLDialogElement } from "../types";


export default function useDialogPolyfill(ref: RefObject<HTMLDialogElement>) {
	let dialogPolyfill: any = null;

	useLayoutEffect(() => {
		if ((window as any).HTMLDialogElement === undefined) {
			if (dialogPolyfill) {
				dialogPolyfill.registerDialog(ref.current);
			} else {
				import("dialog-polyfill").then((polyfill) => {
					polyfill.default.registerDialog(ref.current as any);
					dialogPolyfill = polyfill.default;
				});
			}
		}
	}, [ref]);
}
