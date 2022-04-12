import { useEffect } from "react";
import throttle from "../services/throttle";

export default function useWindowParallax(
	update: (x: number, y: number) => void
) {
	useEffect(() => {

		const pointerHandler = throttle(({ clientX, clientY }: MouseEvent) => {
			const verticalDistanceFromCenter = window.innerHeight / 2 - clientY;
			const horizontalDistanceFromCenter = clientX - window.innerWidth / 2;
			update(horizontalDistanceFromCenter, verticalDistanceFromCenter);
		});

		document.addEventListener("pointermove", pointerHandler);

		return () => document.removeEventListener("pointermove", pointerHandler);
	}, []);
}
