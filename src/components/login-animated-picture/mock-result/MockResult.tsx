import classNames from "classnames";
import s from "./mock-data.module.scss";
import { animated, SpringValue } from "@react-spring/web";
import { HTMLProps } from "react";
import AnimatedNumber from "./AnimatedNumber";

type Props = HTMLProps<HTMLDListElement> & {
	spring: { xys: SpringValue<number[]> }
};

export default function MockResult({ className, spring }: Props) {
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

	const trans = (x: number, y: number, s: number) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;


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
					<AnimatedNumber className={s.value} value={item.value} extra={spring.xys} />
				</div>
			))}
		</animated.dl>
	);
}
