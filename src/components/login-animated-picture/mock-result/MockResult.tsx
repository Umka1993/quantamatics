import classNames from "classnames";
import s from "./mock-data.module.scss";
import { animated, AnimatedComponent, config, Interpolation, SpringValue, useSpring } from "@react-spring/web";
import { CSSProperties, HTMLProps, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";

type Props = HTMLProps<HTMLDListElement> & {

	spring: { xys: SpringValue<number[]> }

};

export default function MockResult({ className, Δ, spring }: Props) {
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

	const trans = (x: number, y: number, s: number) => {
		return `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;
	};


	return (
		<animated.dl
			className={classNames(s.root, className)}
			style={{
				transform: spring.xys.to(trans),
			}}

		>
			{MOCK_DATA.map((item) => (
				<div key={item.key} className={s.group}>
					<dt className={s.title}>{item.key}</dt>
					<AnimatedNumber className={s.value} value={item.value} />

					{/* <animated.dd className={s.value}>{number}</animated.dd> */}
					{/* <dd className={s.value}>{(item.value + Δ).toFixed(2)}%</dd> */}
				</div>
			))}
		</animated.dl>
	);
}
