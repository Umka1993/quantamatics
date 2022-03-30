import { RefObject, useEffect } from "react";

export default function useClickOutside(
	ref: RefObject<HTMLDivElement>,
	callback: () => void,
	state: boolean
) {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref?.current?.contains(<Node>event!.target)) {
				callback();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref, state]);
}
