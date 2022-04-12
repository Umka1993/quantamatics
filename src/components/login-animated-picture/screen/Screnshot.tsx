import { ReactComponent as Vector } from "./vector.svg";
// import s from "./graph.module.scss";
import { SVGProps, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import useWindowParallax from "../../../hooks/useWindowParallax";
import classNames from "classnames";

type Props = SVGProps<SVGSVGElement> & {
	// spring: { xys: SpringValue<number[]> }
};

export default function Screnshot({ className }: Props) {
	const [xys, setXYS] = useState([0, 0, 1]);

	const props = useSpring({
		xys,
		config: { mass: 5, tension: 350, friction: 40 },
		delay: 200,
	});

	useWindowParallax((x, y) => { setXYS([-x / 1000, -y / 1000, 1]) });

	const trans = (x: number, y: number, s: number) =>
		`perspective(100px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

	return (
		<animated.svg
			width={711}
			height={401}
			aria-hidden
			viewBox="0 0 711 401"
			style={{
				// eslint-disable-next-line react/prop-types
				transform: props.xys.to(trans),
			}}
			fill="none"
			className={classNames(
				// s.root,
				className)}

		>
			<Vector />
		</animated.svg>
	);
}
