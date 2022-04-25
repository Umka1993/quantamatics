import classNames from "classnames";
import s from "./mock-data.module.scss";
import { HTMLProps } from "react";
import AnimatedNumber from "./AnimatedNumber";

type Props = HTMLProps<HTMLDListElement> & {
	coefficient?: number;
	titles: string[];
	values: number[];
};

export default function MockResult({
	className,
	coefficient = 1,
	titles,
	values,
	...other
}: Props) {

	return (
		<dl className={classNames(s.root, className)} {...other}>
			{titles.map((title, index) => (
				<div key={title} className={s.group}>
					<dt className={s.title}>{title} YoY</dt>
					<AnimatedNumber className={s.value} value={values[index] * coefficient} coefficient={coefficient} />
				</div>
			))}
		</dl>
	);
}
