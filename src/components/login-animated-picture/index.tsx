import gsap from "gsap";

import { useSpring, animated, config } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";
import style from "./login-animated-picture.module.scss";
import MockResult from "./mock-result/MockResult";

export default function LoginAnimatedPicture() {
	const rootRef = useRef<HTMLDivElement>(null);
	const [xys, setXYS] = useState([0, 0, 1]);

	function updateRatios(x: number, y: number) {
		setXYS([
			Math.floor(gsap.utils.clamp(-100, 100, x)) / 100,
			Math.floor(gsap.utils.clamp(-100, 100, y)) / 100,
			1.2,
		]);
	}

	useEffect(() => {
		const generateHandler =
			(
				element: HTMLElement,
				proximity: number,
				bounds: number,
				cb: (x: number, y: number) => void
			) =>
				({ x, y }) => {
					const elementBounds = element.getBoundingClientRect();
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
					cb(boundX, boundY);
				};

		document.addEventListener(
			"pointermove",
			generateHandler(document.body, 100, 100, updateRatios)
		);
	}, []);

	const calc = (x: number, y: number, rect: DOMRect) => [
		-(y - rect.top - rect.height / 2) / 5,
		(x - rect.left - rect.width / 2) / 5,
		1.4,
	];


	const spring = useSpring({
		mass: 1,
		tension: 170,
		friction: 26,
		clamp: false,
		precision: 0.01,
		velocity: 0,
		easing: (t: any) => t,
		xys,
	});

	const trans = (x: number, y: number, s: number) => {
		return `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;
	};
	// const springProps = useSpring({
	// 	config: config.gentle,
	// 	xys
	// });


	return (
		<div
			role="img"
			className={style.wrap}
			aria-label="Mock Example"
			ref={rootRef}
		>
			<MockResult
				style={{ transform: spring.xys.to(trans) }}

				// spring={springProps}
				Δ={0}
			/>
		</div>
	);
}
