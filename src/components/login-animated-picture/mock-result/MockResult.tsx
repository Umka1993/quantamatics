import classNames from "classnames";
import s from "./mock-data.module.scss";
import { HTMLProps } from "react";

type Props = HTMLProps<HTMLDListElement> & {
	// spring: { xys: SpringValue<number[]> }
};

export default function MockResult({ className, ...other }: Props) {
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
	return (
		<dl
			className={classNames(s.root, className)}
			{...other}
		>
			{MOCK_DATA.map(({ key, value }) => (
				<div key={key} className={s.group}>
					<dt className={s.title}>{key}</dt>
					<dd className={s.value}>{value}</dd>
					{/* <AnimatedNumber className={s.value} value={item.value} extra={spring.xys} /> */}
				</div>
			))}
		</dl>
	);
}
