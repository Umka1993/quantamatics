import classNames from "classnames";
import s from "./mock-data.module.scss";
import { animated, AnimatedComponent, Interpolation, SpringValue } from "@react-spring/web";

type Props = {
	Δ: number;
	className?: string;
	// spring: SpringValue<number[]>;
	style: { transform: Interpolation<number[], string> };
};

export default function MockResult({ className, Δ, style }: Props) {
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
			style={style}
			aria-hidden
		>
			{MOCK_DATA.map((item) => (
				<div key={item.key} className={s.group}>
					<dt className={s.title}>{item.key}</dt>
					<dd className={s.value}>{(item.value + Δ).toFixed(2)}%</dd>
				</div>
			))}
		</animated.dl>
	);
}
