import { RefObject, useEffect, useState } from "react";
import throttle from "../services/throttle";

export default function usePercentFromCenter(
	wrapper: RefObject<HTMLElement>, timeToThrottle = 1000
): number[] {
	const [ratioX, setRatioX] = useState(0);
	const [ratioY, setRatioY] = useState(0);

	useEffect(() => {
		const pointerHandler = throttle(({ clientX, clientY }: MouseEvent) => {
			const [height, width] = wrapper.current
				? [wrapper.current.clientWidth, wrapper.current.clientHeight]
				: [window.innerWidth, window.innerHeight];

			const verticalDistanceFromCenter = (height / 2 - clientY) / height;
			const horizontalDistanceFromCenter = (width / 2 - clientX) / width;

			setRatioX(horizontalDistanceFromCenter);
			setRatioY(verticalDistanceFromCenter);
		}, timeToThrottle);

		const target = wrapper.current || document

		target.addEventListener("pointermove", pointerHandler);

		return () => target.removeEventListener("pointermove", pointerHandler);
	}, [wrapper.current]);

	return [ratioX, ratioY];
}
