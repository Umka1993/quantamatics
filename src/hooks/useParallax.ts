import gsap from "gsap";
import { RefObject, useCallback, useEffect } from "react";

type ProximityFunctionType = () => number;

export default function useParallax(
	callback: (first: number, second: number) => void,
	elementRef: RefObject<HTMLDivElement>,
	proximityArg: ProximityFunctionType | number = 100
) {

	const update = useCallback(({ x, y }: PointerEvent) => {
		const bounds = 100;
		const proximity =
			typeof proximityArg === "function" ? proximityArg() : proximityArg;

		if (elementRef.current) {
			const elementBounds = elementRef.current.getBoundingClientRect();
			const centerX = elementBounds.left + elementBounds.width / 2;
			const centerY = elementBounds.top + elementBounds.height / 2;
			const boundX = gsap.utils.mapRange(
				centerX - proximity,
				centerX + proximity,
				-bounds,
				bounds,
				x
			);
			const boundY = gsap.utils.mapRange(
				centerY - proximity,
				centerY + proximity,
				-bounds,
				bounds,
				y
			);
			callback(boundX / 100, boundY / 100);
		}
	}, [elementRef.current, callback, proximityArg])
	useEffect(() => {
		if (!elementRef.current || !callback) return;

		window.addEventListener("pointermove", update);
		return () => {
			window.removeEventListener("pointermove", update);
		};
	}, [elementRef.current, callback, proximityArg]);
}
