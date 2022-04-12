import { useSpring } from "@react-spring/web";
import { useEffect } from "react";
import style from "./login-animated-picture.module.scss";
import MockResult from "./mock-result/MockResult";
import Graph from "./graph/Graph";
import useWindowParallax from "../../hooks/useWindowParallax";

export default function LoginAnimatedPicture() {
	const [props, animate] = useSpring(() => ({
		xys: [0, 0, 1],
		config: { mass: 5, tension: 350, friction: 40 },
	}));

	useWindowParallax((x, y) =>
		animate({
			xys: [x / 50, y / 50, 1.02],
			delay: 200,
		})
	);

	return (
		<div role="img" className={style.wrap} aria-label="Mock Example">
			<Graph spring={props} />
			<MockResult spring={props} aria-hidden />
		</div>
	);
}
