import { useEffect, useState } from "react";
import throttle from "../services/throttle";

export default function usePercentFromCenter(): number[]  {
	const [ratioX, setRatioX] = useState(0);
	const [ratioY, setRatioY] = useState(0);

	useEffect(() => {

		const pointerHandler = throttle(({ clientX, clientY }: MouseEvent) => {
			const verticalDistanceFromCenter = (window.innerHeight / 2 - clientY) / window.innerHeight;
			const horizontalDistanceFromCenter = (window.innerWidth / 2 - clientX) / window.innerWidth;

			setRatioX(horizontalDistanceFromCenter);
			setRatioY(verticalDistanceFromCenter);
		}, 1000);

		document.addEventListener("pointermove", pointerHandler);

		return () => document.removeEventListener("pointermove", pointerHandler);
	}, []);

	return [ratioX, ratioY]
}
