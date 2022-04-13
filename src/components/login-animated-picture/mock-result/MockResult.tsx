import classNames from "classnames";
import s from "./mock-data.module.scss";
import { HTMLProps } from "react";
import AnimatedNumber from "./AnimatedNumber";

type Props = HTMLProps<HTMLDListElement> & {
	coefficient?: number;
};

export default function MockResult({
	className,
	coefficient = 1,
	...other
}: Props) {
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
		<dl className={classNames(s.root, className)} {...other}>
			{MOCK_DATA.map(({ key, value }) => (
				<div key={key} className={s.group}>
					<dt className={s.title}>{key}</dt>
					<AnimatedNumber className={s.value} value={value} />
				</div>
			))}
		</dl>
	);
}
