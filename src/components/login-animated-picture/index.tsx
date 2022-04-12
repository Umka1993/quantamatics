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

	return (
		<div role="img" className={style.wrap} aria-label="Mock Example">
			<Screenshot
				aria-hidden
				style={{
					transform: `rotateX(${ratioY * 20}deg) rotateY(${-ratioX * 20}deg)`,
				}}
				className={style.screen}
				coefficient={clamp(Math.abs(ratioY + ratioX), 0.4, 1)}
			/>
			{/* <Graph className={style.graph} />
			<MockResult className={style.result} aria-hidden /> */}
		</div>
	);
}
