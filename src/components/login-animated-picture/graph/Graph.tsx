import s from "./graph.module.scss";
import { HTMLAttributes, useEffect, useMemo, useState } from "react";
import classNames from "classnames";

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine
} from "recharts";

// ['2020 W26', '2020 W27', '2020 W28', '2020 W29', '2020 W30', '2020 W31', '2020 W32', '2020 W33', '2020 W34', '2020 W35', '2020 W36', '2020 W37', '2020 W38', '2020 W39', '2020 W40', '2020 W41', '2020 W42', '2020 W43', '2020 W44', '2020 W45', '2020 W46', '2020 W47', '2020 W48', '2020 W49', '2020 W50', '2020 W51', '2020 W52', '2021 W1', '2021 W2', '2021 W3']
// Actual Quarter Analysis

// "Nunito", system-ui, sans-serif
// 	color: 'hsl(208, 100%, 22%)',

type Props = HTMLAttributes<HTMLDivElement> & {
	coefficient: number;
};

interface ToolTipProps {
	active?: boolean
	payload?: Array<{ value: string, unit: string, name: string }>,
	label?: string;
}

const CustomTooltip = ({ payload }: ToolTipProps) => {
	if (payload && payload.length === 2) {

		return (
			<p className={s.tooltip}>
				{payload[1].name}
				<span>
					{payload[1].value}
					{payload[1].unit}
				</span>
			</p>

		);
	}

	return null;
};

export default function Graph({ className, coefficient = 1, ...other }: Props) {
	const initialData = useMemo(() => {
		const DATA = [
			0, 8, 2, 4, -2, 5, -1, 7, 0, 6, 3, 4, -4, 9, 4, -2, -8, 9, -24, -6, 0, 12,
			4, 2, 10, 10, 6, 0, 6, 4,
		];
		const START_YEAR = 2021;
		const START_WEEK = 26;

		return DATA.map(function (value, index) {
			const allWeek = START_WEEK + index;
			const year = START_YEAR + Math.floor(allWeek / 52);

			return {
				name: `${year} ${allWeek % 52}W`,
				top: value,
				bottom: value - 5,
			};
		});
	}, []);

	const data = useMemo(
		() =>
			initialData.map((value) => ({
				name: value.name,
				bottom: (value.bottom * coefficient).toFixed(2),
				top: (value.top * coefficient).toFixed(2),
			})),
		[coefficient]
	);



	// const [data, setData] = useState(DATA);
	// const [secondData, setSecondData] = useState<number[]>([]);

	// useEffect(() => {
	// 	setData(DATA.map(value => value * coefficient))

	// 	setSecondData(DATA.map(value => (value - 5) * coefficient))
	// }, [coefficient])

	return (
		<div className={classNames(s.root, className)} {...other}>
			<p className={s.title}>Actual Quarter Analysis</p>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					width={392}
					height={230}
					data={data}
					margin={{ top: 10, right: 20, bottom: 15, left: 20 }}
				>
					<CartesianGrid color="#DCDCDC" vertical={false} />
					<XAxis
						dataKey="name"
						padding={{ left: 5, right: 5 }}
						tickCount={8}
						fontSize={10}
						tickLine={false}
						interval={6}
					/>
					<YAxis
						unit={"%"}
						domain={[-35, 20]}
						ticks={[-30, -20, -10, 0, 10, 20]}
						tickLine={false}
						fontSize={10}
						width={30}
						color={'#919191'} //#4F4F4F'}
					/>
					<Tooltip
						content={<CustomTooltip />}
						contentStyle={{
							backgroundColor: '#739bff',
							color: 'white',
							borderRadius: '3px'
						}}

					/>
					<Line
						type="linear"
						dataKey="top"
						unit={"%"}
						name="Panel YoY"
						stroke="rgb(53, 162, 235)"
						activeDot={{ r: 4 }}
						dot={false}

					/>
					<Line
						type="linear"
						dataKey="bottom"
						unit={"%"}
						name="Panel YoY"
						stroke="hsl(256, 93%, 70%)"
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
