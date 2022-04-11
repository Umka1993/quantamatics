import { useSpring } from "@react-spring/web";
import { useEffect, useRef } from "react";
import style from "./login-animated-picture.module.scss";
import MockResult from "./mock-result/MockResult";

export default function LoginAnimatedPicture() {

	const [props, animate] = useSpring(() => ({
		xys: [0, 0, 1],
		config: { mass: 5, tension: 350, friction: 40 },
	}));


	function pointerHandler({ clientX, clientY }: MouseEvent) {
		const verticalDistanceFromCenter = window.innerHeight / 2 - clientY;
		const horizontalDistanceFromCenter = clientX - window.innerWidth / 2;
		// console.log(verticalDistanceFromCenter, horizontalDistanceFromCenter);
		animate({
			xys: [
				horizontalDistanceFromCenter / 50,
				verticalDistanceFromCenter / 50,
				1.02,
			],
			delay: 200,
		});
	}

	useEffect(() => {
		document.addEventListener("pointermove", pointerHandler);

		return () => document.removeEventListener("pointermove", pointerHandler);
	}, []);

	return (
		<div
			role="img"
			className={style.wrap}
			aria-label="Mock Example"
		>
			<MockResult
				spring={props}
				aria-hidden
			/>

		</div>
	);
}
