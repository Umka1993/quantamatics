import { useSpring } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";
import style from "./login-animated-picture.module.scss";
import MockResult from "./mock-result/MockResult";
import Graph from "./graph/Graph";
import gsap from "gsap";
import useParallax from "../../hooks/useParallax";


export default function LoginAnimatedPicture() {

	const rootRef = useRef<HTMLDivElement>(null)

	useParallax(
		(x: number, y: number) => {
			if (rootRef.current) {
				rootRef.current.style.setProperty(
					"--range-x",
					String(Math.floor(gsap.utils.clamp(-60, 60, x * 100)))
				);
				rootRef.current.style.setProperty(
					"--range-y",
					String(Math.floor(gsap.utils.clamp(-60, 60, y * 100)))
				);
			}
		},
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
			/>

		</div>
	);
}
