import { useSpring } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";
import style from "./login-animated-picture.module.scss";
import MockResult from "./mock-result/MockResult";
import Graph from "./graph/Graph";
import gsap from "gsap";
import useParallax from "../../hooks/useParallax";
import throttle from "../../services/throttle";

export default function LoginAnimatedPicture() {
	const [ratioX, setRatioX] = useState(0);
	const [ratioY, setRatioY] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);

	useParallax(
		throttle((x: number, y: number) => {
			setRatioX(Math.floor(gsap.utils.clamp(-60, 60, x * 100)));
			setRatioY(Math.floor(gsap.utils.clamp(-60, 60, y * 100)));
			// if (rootRef.current) {
			// 	rootRef.current.style.setProperty(
			// 		"--range-x",
			// 		String(Math.floor(gsap.utils.clamp(-60, 60, x * 100)))
			// 	);
			// 	rootRef.current.style.setProperty(
			// 		"--range-y",
			// 		String(Math.floor(gsap.utils.clamp(-60, 60, y * 100)))
			// 	);
			// }
		}, 1000),
		rootRef,
		() => window.innerWidth * 0.5
	);

	return (
		<div
			role="img"
			className={style.wrap}
			aria-label="Mock Example"
			ref={rootRef}
		>
			{/* <Graph spring={props} />
			 */}
			<MockResult
				className={style.result}
				aria-hidden
				style={{
					transform: `perspective(600px) rotateX(${ratioX / 10}deg) rotateY(${
						ratioY / 10
					}deg) scale(1.2)`,
				}}
			/>
		</div>
	);
}
