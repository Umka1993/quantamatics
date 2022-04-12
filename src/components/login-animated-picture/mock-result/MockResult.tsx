import classNames from "classnames";
import s from "./mock-data.module.scss";
import { animated, useSpring } from "@react-spring/web";
import { HTMLProps, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";
import useWindowParallax from "../../../hooks/useWindowParallax";

type Props = HTMLProps<HTMLDListElement>;

export default function MockResult({ className }: Props) {
	const MOCK_DATA = [
		{
			key: "Spend YoY",
			value: 22.57,
		},
		{
			key: "Transactions YoY",
			value: 27.43,
		},
		{
			key: "Avg. Ticket Size YoY",
			value: -3.9,
		},
	];

	const [xys, setXYS] = useState([0, 0, 1])

	const [accuracy, setAccuracy] = useState(0);

	const props = useSpring({
		xys,
		config: { mass: 5, tension: 350, friction: 40 },
		delay: 200
	});

	useWindowParallax((x, y) => {
		setXYS([x / 50, y / 50, 1.02])
		setAccuracy(Math.max(x, y) / 100);
	});

	const trans = (x: number, y: number, s: number) =>
		`perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

	return (
		<animated.dl
			className={classNames(s.root, className)}
			style={{
				transform: props.xys.to(trans),
			}}
		>
			{MOCK_DATA.map(({ key, value }) => (
				<div key={key} className={s.group}>
					<dt className={s.title}>{key}</dt>
					<AnimatedNumber
						className={s.value}
						value={value + accuracy}
					/>
				</div>
			))}
		</animated.dl>
	);
}
