import { RefObject, useCallback, useEffect } from "react";
import { HTMLDialogElement } from "../types";

export default function useCloseOutsideDialog(
	ref: RefObject<HTMLDialogElement>,
	isEnable: boolean,
	open: boolean | undefined,
	onRequestClose: () => void
) {
	const closeDialogOnOutsideClick = useCallback(
		(evt: MouseEvent) => {
			const dialogNode = ref.current;

			if (dialogNode) {
				const isClickOnDialog =
					evt.target === dialogNode || dialogNode.contains(evt.target as Node);

				!isClickOnDialog && dialogNode.open && onRequestClose();
			}
		},
		[ref.current]
	);

	useEffect(() => {
		if (ref.current && isEnable && open) {
			const timeOut = setTimeout(
				() => document.addEventListener("click", closeDialogOnOutsideClick),
				200
			);

			return () => {
				clearTimeout(timeOut);
				document.removeEventListener("click", closeDialogOnOutsideClick);
			};
		}
	}, [isEnable, ref.current, open]);
}
