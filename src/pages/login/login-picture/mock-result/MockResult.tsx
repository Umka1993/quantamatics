import classNames from 'classnames';
import { HTMLProps } from 'react';
import style from './mock-data.module.scss';

export default function MockResult({ className }: HTMLProps<HTMLDListElement>) {

	const MOCK_DATA = [
		{
			key: "Spend YoY",
			value: 22.57
		},
		{
			key: "Transactions YoY",
			value: 27.43
		},
		{
			key: "Avg. Ticket Size YoY",
			value: -3.9
		}
	];
	return (
		<dl className={classNames(style.root, className)}>
			{MOCK_DATA.map((item) => (
				<div key={item.key} className={style.group}>
					<dt className={style.title}>{item.key}</dt>
					<dd className={style.value}>{(item.value).toFixed(2)}%</dd>
				</div>
			))}
		</dl>
	);
}
