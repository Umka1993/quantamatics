import { useEffect } from "react";
import throttle from "../services/throttle";

export default function useWindowParallax(
	update: (x: number, y: number) => void
) {
	useEffect(() => {

		const pointerHandler = throttle(({ clientX, clientY }: MouseEvent) => {
			const verticalDistanceFromCenter = (window.innerHeight / 2 - clientY) / window.innerHeight;
			const horizontalDistanceFromCenter = (window.innerWidth / 2 - clientX) / window.innerWidth ;
			update(horizontalDistanceFromCenter, verticalDistanceFromCenter);
		}, 1000);

		document.addEventListener("pointermove", pointerHandler);

		return () => document.removeEventListener("pointermove", pointerHandler);
	}, []);
}
