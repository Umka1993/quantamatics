import style from "./screenshot.module.scss";
import {
	CSSProperties,
	HTMLAttributes,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from "react";
import classNames from "classnames";
import ResponsiveImage from "../../responsive-image/ResponsiveImage";

import { init, ECharts } from "echarts";

/* echarts.registerTheme("quant-bars", {
	color: ["hsla(348,100%,93%,0.6)", "#8fd3ff", "#d9d5f3"],
	backgroundColor: "transparent",
	title: {
		textStyle: {
			color: "#003c71",
		},
		subtextStyle: {
			color: "#93b7e3",
		},
	},
}); */

type Props = HTMLAttributes<HTMLDivElement> & {
	coefficient?: number;
};

const INITIAL_BLUE = [4.2, 3, 3.5, 2.8, 3, 3.8, 4.1, 3.5, 3.4, 5.4, 3.9, 4.2];

const INITIAL_RED = [0, 0, -2, -1, -0.5, -0.7, -0.2, 1, -3, 1.5, -0.4, 0.4];

const INITIAL_PURPLE = [0, 0, 1.8, 2.4, 2.6, 3, 5, 3.5, 0.5, 6.5, 3.4, 4.4];

export default function Screenshot({
	className,
	coefficient = 1,
	...other
}: Props) {
	const graphRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<ECharts>();

	const xLabels = useMemo(() => {
		const MAX_ELEMENTS = 11;
		const START_YEAR = 2019;
		const START_QUARTER = 2;

		const labels: string[] = [];

		for (let index = 0; index < MAX_ELEMENTS; index++) {
			const quarters = START_QUARTER + index;
			const quarter = quarters % 4;
			const year = START_YEAR + Math.floor((quarters - 1) / 4);

			labels.push(`${year}-${quarter ? quarter : 4}Q`);
		}
		return labels;
	}, []);

	useEffect(() => {
		if (graphRef.current) {
			const chart = init(
				graphRef.current,
				{
					color: ["hsla(348,100%,93%,0.6)", "#8fd3ff", "#d9d5f3"],
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
						}
					},
					categoryAxis: {
						axisTick: {
							show: false
						}
					}
				},
				{
					renderer: "svg",
				}
			);

			chart.setOption({
				title: {
					text: "One Period out of Sample Linear Regression Forecast (YoY, %)",
					padding: [10, 40],
				},
				tooltip: {},
				legend: {
					data: ["KPI YoY %", "Forecast KPI %"],
					right: "5%",
					top: 5,
					icon: 'circle'
				},
				grid: {
					right: '6%',
					left: '6%',
					bottom: '14%'
				},
				xAxis: {
					data: xLabels,
					axisLabel: {
						fontFamily: '"Nunito", system-ui, sans-serif',
						fontSize: 8,
					}
				},
				yAxis: {
					axisLabel: {
						formatter: "{value}%",
						align: "center",
						fontFamily: '"Nunito", system-ui, sans-serif',
						fontSize: 10,
					},
					min: -4,
					max: 8,
				},
				series: [
					{
						type: "bar",
						data: INITIAL_RED,
					},
					{
						type: "bar",
						name: "KPI YoY %",
						data: INITIAL_BLUE,
					},
					{
						type: "bar",
						name: "Forecast KPI %",
						data: INITIAL_PURPLE,
					},
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

	useEffect(() => {
		if (graphRef.current) {
			chartRef.current?.setOption({
				series: [
					{
						data: INITIAL_RED.map((value) => (value * coefficient).toFixed(2)),
					},
					{
						type: "bar",
						name: "KPI YoY %",
						data: INITIAL_BLUE.map((value) =>
							(value * (0.8 - coefficient)).toFixed(2)
						),
					},
					{
						type: "bar",
						name: "Forecast KPI %",
						data: INITIAL_PURPLE.map((value) =>
							(value * coefficient).toFixed(2)
						),
					},
				],
			});
		}
	}, [chartRef.current, coefficient]);

	return (
		<div className={classNames(style.root, className)} {...other}>
			<ResponsiveImage
				source="img/login/screen"
				extensions={["avif", "webp", "png"]}
				ratios={[2]}
				alt="Screenshot of App"
				height={401}
				width={712}
				className={style.image}
			/>
			<div className={style.graph} ref={graphRef} />
		</div>
	);
}
