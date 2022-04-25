import s from "./graph.module.scss";
import { HTMLAttributes, useEffect, useMemo, useRef } from "react";
import classNames from "classnames";
import { ECharts, init } from "echarts";

type Props = HTMLAttributes<HTMLDivElement> & {
	coefficient: number;
};

const INITIAL_DATA = [
	0, 8, 2, 4, -2, 5, -1, 7, 0, 6, 3, 4, -4, 9, 4, -2, -8, 9, -24, -6, 0, 12, 4,
	2, 10, 10, 6, 0, 6, 4,
];

export default function Graph({ className, coefficient = 1, ...other }: Props) {
	const graphRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<ECharts>();


	const xLabels = useMemo(() => {
		const START_YEAR = 2021;
		const START_WEEK = 26;

		return INITIAL_DATA.map((value, index) => {
			const allWeek = START_WEEK + index;
			const year = START_YEAR + Math.floor(allWeek / 52);

			return `${year} ${allWeek % 52}W`;
		});
	}, [INITIAL_DATA]);


	useEffect(() => {
		if (graphRef.current) {
			const chart = init(
				graphRef.current,
				{
					color: ["hsl(256, 93%, 70%)", "hsl(204, 88%, 63%)"],
					backgroundColor: "transparent",
					title: {
						textStyle: {
							color: "#003c71",
							fontFamily: '"Nunito", system-ui, sans-serif',
							fontSize: 12,
						},
						subtextStyle: {
							color: "#93b7e3",
						},
					},
					legend: {
						textStyle: {
							color: "#6E6E6E",
							fontFamily: '"Nunito", system-ui, sans-serif',
							fontSize: 8,
						},
					},
					line: {
						itemStyle: {
							borderWidth: 2
						},
						lineStyle: {
							width: 2
						},
						symbolSize: 2,
						symbol: "circle",
						smooth: false
					},
				},
				{
					renderer: "svg",
				}
			);

			chart.setOption({
				title: {
					text: "Actual Quarter Analysis",
					padding: [10, 40],
				},
				tooltip: {
					trigger: 'item',
					triggerOn: 'mousemove|click',
					// triggerOn: 'none',
					// formatter: Tooltip,
				},
				grid: {
					right: "6%",
					left: "6%",
					bottom: "14%",
				},
				xAxis: {
					data: xLabels,
					axisLabel: {
						fontFamily: '"Nunito", system-ui, sans-serif',
						fontSize: 8,
					},
				},
				yAxis: {
					axisLabel: {
						formatter: "{value}%",
						align: "center",
						fontFamily: '"Nunito", system-ui, sans-serif',
						fontSize: 10,
					},
					min: -30,
					max: 20,
				},
				series: [
					{
						data: INITIAL_DATA,
						type: 'line',
						name: "Panel YoY",
					},

					{
						data: INITIAL_DATA.map(value => value - 5),
						type: 'line',
						name: "Panel YoY",
					}
				],
			});

			chartRef.current = chart;

			const resizeObserver = new ResizeObserver(() => chart.resize());
			resizeObserver.observe(graphRef.current);

			return () => {
				resizeObserver.disconnect();
			};
		}
	}, [graphRef.current]);

	return (
		<div className={classNames(s.root, className)} ref={graphRef} {...other} />
		// <p className={s.title}>Actual Quarter Analysis</p>
		// 	<ResponsiveContainer width="100%" height="100%">
		// 		<LineChart
		// 			width={392}
		// 			height={230}
		// 			data={data}
		// 			margin={{ top: 10, right: 20, bottom: 15, left: 20 }}
		// 		>
		// 			<CartesianGrid color="#DCDCDC" vertical={false} />
		// 			<XAxis
		// 				dataKey="name"
		// 				padding={{ left: 5, right: 5 }}
		// 				tickCount={8}
		// 				fontSize={10}
		// 				tickLine={false}
		// 				interval={6}
		// 			/>
		// 			<YAxis
		// 				unit={"%"}
		// 				domain={[-35, 20]}
		// 				ticks={[-30, -20, -10, 0, 10, 20]}
		// 				tickLine={false}
		// 				fontSize={10}
		// 				width={30}
		// 				color={"#919191"} //#4F4F4F'}
		// 			/>
		// 			<Tooltip
		// 				content={<CustomTooltip />}
		// 				contentStyle={{
		// 					backgroundColor: "#739bff",
		// 					color: "white",
		// 					borderRadius: "3px",
		// 				}}
		// 			/>
		// 			<Line
		// 				type="linear"
		// 				dataKey="top"
		// 				unit={"%"}
		// 				name="Panel YoY"
		// 				stroke="rgb(53, 162, 235)"
		// 				activeDot={{ r: 4 }}
		// 				dot={false}
		// 			/>
		// 			<Line
		// 				type="linear"
		// 				dataKey="bottom"
		// 				unit={"%"}
		// 				name="Panel YoY"
		// 				stroke="hsl(256, 93%, 70%)"
		// 				dot={false}
		// 			/>
		// 		</LineChart>
		// 				</ResponsiveContainer>
	);
}


interface ToolTipProps {
	$vars: string[],
	borderColor?: string
	color: string;
	componentIndex: 1
	componentSubType: "line"
	componentType: "series"
	data: number,
	// dataIndex: 21
	// dataType: undefined
	// dimensionNames: (2) ['x', 'y']
	// encode: {x: Array(1), y: Array(1)}

	marker: string
	name: string
	seriesIndex: 1
	seriesName: string
	seriesType: string
	value: number
}

function Tooltip(params: ToolTipProps) {
	console.log(params)
	return <p>test</p>
}


