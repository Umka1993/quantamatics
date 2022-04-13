import style from "./login-animated-picture.module.scss";
import MockResult from "./mock-result/MockResult";
import Graph from "./graph/Graph";
import Screenshot from "./screen/Screenshot";
import useWindowParallax from "../../hooks/useWindowParallax";
import { useState } from "react";
import clamp from "../../services/clamp";

export default function LoginAnimatedPicture() {
	const [ratioX, setRatioX] = useState(0);
	const [ratioY, setRatioY] = useState(0);

	useWindowParallax((x, y) => {
		setRatioX(x);
		setRatioY(y);
	});

	const sum = ratioY + ratioX;

	return (
		<div role="img" className={style.wrap} aria-label="Mock Example">
			<Screenshot
				aria-hidden
				style={{
					transform: `translateZ(10vmin) rotateX(${ratioY * 20}deg) rotateY(${ratioX * 20
					}deg)`,
				}}
				className={style.screen}
				coefficient={clamp(Math.abs(sum), 0.4, 1)}
			/>

			<Graph
				className={style.graph}
				width={392}
				height={231}
				style={{
					transform: `translate3d(0, 0, 40vmin) scale(0.6) rotateX(${ratioY * 24
					}deg) rotateY(${ratioX * 24}deg)`,
				}}
				aria-hidden
			/>

			<MockResult
				className={style.result}
				aria-hidden
				style={{
					transform: `translate3d(0, 0, 80vmin) scale(0.304) rotateX(${ratioY * 18
					}deg) rotateY(${ratioX * 18}deg)`,
				}}
				coefficient={sum}
			/>
		</div>
	);
}
