import { ReactComponent as Vector } from "./vector.svg";
import s from "./graph.module.scss";
import { SVGProps, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import useWindowParallax from "../../../hooks/useWindowParallax";
import classNames from "classnames";

type Props = SVGProps<SVGSVGElement> & {
	// spring: { xys: SpringValue<number[]> }
};

export default function Graph({ className }: Props) {
	const [xys, setXYS] = useState([0, 0, 1]);

	const props = useSpring({
		xys,
		config: { mass: 5, tension: 350, friction: 40 },
		delay: 200,
	});

	useWindowParallax((x, y) => { setXYS([-x / 100, -y / 100, 1]) });

	const trans = (x: number, y: number, s: number) =>
		`perspective(100px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

	return (
		<animated.svg
			width={392}
			height={231}
			aria-hidden
			style={{ props }}
			viewBox="0 0 392 231"
			fill="none"
			className={classNames(s.root, className)}
		>
			<Vector />
		</animated.svg>
	);
}
