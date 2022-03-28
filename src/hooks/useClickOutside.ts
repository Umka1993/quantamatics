import React, { RefObject, useEffect } from "react";

export const useClickOutside = (ref: RefObject<HTMLDivElement>, callback: () => void, state: boolean) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent): void => {
			if (ref.current && !ref?.current?.contains(<Node>(event!.target))) {
				callback()
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref, state]);
}
