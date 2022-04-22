import style from "./screenshot.module.scss";
import { HTMLAttributes, useCallback, useMemo } from "react";
import classNames from "classnames";
import ResponsiveImage from "../../responsive-image/ResponsiveImage";
import { ReactComponent as SelectIcon } from './assets/select.svg'

import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
	GridComponent,
	TooltipComponent,
	TitleComponent,
	DatasetComponent,
} from "echarts/components";
import { SVGRenderer } from "echarts/renderers";

echarts.use(
	[TitleComponent, TooltipComponent, GridComponent, BarChart, SVGRenderer]
);

echarts.registerTheme('quant-bars', {
	color: [
		"hsla(348,100%,93%,0.6)",
		"#8fd3ff",
		"#d9d5f3"
	]
})


type Props = HTMLAttributes<HTMLDivElement> & {
	coefficient?: number;
};
// const BLUE_BARS = [65, 46, 50, 42, 44, 50, 64, 50, 46, 77, 52, 67];
// const PURPLE_BARS = [28, 38, 40, 46, 78, 53, 4, 102, 49, 72]
// const RED_BARS = [-5, -2, -4, -1, 15, 3, -42, 25, -2, 5]

export default function Screenshot({
	className,
	coefficient = 1,
	...other
}: Props) {
	const title = {
		font: {
			family: '"Nunito", system-ui, sans-serif',
		},
		color: "#828282"
	}

	const xLabels = useMemo(() => {
		const MAX_ELEMENTS = 11;
		const START_YEAR = 2019;
		const START_QUARTER = 2;

		const labels: string[] = []

		for (let index = 0; index < MAX_ELEMENTS; index++) {
			const quarters = START_QUARTER + index;
			const quarter = quarters % 4;
			const year = START_YEAR + Math.floor((quarters - 1) / 4)

			labels.push(`${year}-${quarter ? quarter : 4}Q`)
		}
		return labels;
	}, [])

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
			<div className={style.graph}>
				<ReactEChartsCore
					echarts={echarts}
					option={{
						// xAxis: {
						// 	data: xLabels
						// },
						yAxis: {},
						xAxis: { type: 'category' },
						series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
						dataset: {
							// Provide a set of data.
							source: [
								['product', '2015', '2016', '2017'],
								['Matcha Latte', 43.3, 85.8, 93.7],
								['Milk Tea', 83.1, 73.4, 55.1],
								['Cheese Cocoa', 86.4, 65.2, 82.5],
								['Walnut Brownie', 72.4, 53.9, 39.1]
							]
						},
						// series: [
						// 	{
						// 		type: 'bar',
						// 		data: [0, 0, -2, -1, -0.5, -0.7, -0.2, 1, -3, 1.5, -0.4, 0.4].map(value => value * coefficient)
						// 	},
						// 	{
						// 		type: 'bar',
						// 		name: 'KPI YoY %',
						// 		data: [4.2, 3, 3.5, 2.8, 3, 3.8, 4.1, 3.5, 3.4, 5.4, 3.9, 4.2].map(value => value * (0.8 - coefficient))
						// 	},

						// 	{
						// 		data: [0, 0, 1.8, 2.4, 2.6, 3, 5, 3.5, 0.5, 6.5, 3.4, 4.4].map(value => value * coefficient)
						// 	}
						// ]
					}}
					notMerge={true}
					lazyUpdate={true}
					theme={"quant-bars"}
				// onChartReady={this.onChartReadyCallback}
				// onEvents={EventsDict}
				// opts={ }
				/>

			</div>
			{/* <div className={style.graph}>
				<Bar

					width={500}
					height={180}
					options={{
						plugins: {
							legend: {
								display: false
							},
							title: {
								display: false,
							},
						},
						maintainAspectRatio: false,
						scales: {
							y: {
								min: -4,
								max: 8,
								title,
								ticks: {
									callback: (value) => `${value}%`
								}
							},
							x: {
								grid: {
									display: false,
								},
								title,
							}
						}

					}}
					data={{
						datasets: [
							{
								label: 'KPI YoY %',
								data: [4.2, 3, 3.5, 2.8, 3, 3.8, 4.1, 3.5, 3.4, 5.4, 3.9, 4.2].map(value => value * (0.8 - coefficient)),
								backgroundColor: 'rgb(110, 192, 246)',
							},
							{
								label: 'Forecast KPI %',
								data: [0, 0, 1.8, 2.4, 2.6, 3, 5, 3.5, 0.5, 6.5, 3.4, 4.4].map(value => value * coefficient),
								backgroundColor: 'rgb(217, 213, 243)',
							},

							{
								label: '',
								data: [0, 0, -2, -1, -0.5, -0.7, -0.2, 1, -3, 1.5, -0.4, 0.4].map(value => value * coefficient),
								backgroundColor: 'rgb(255 217 224 / 60%)',
							},
						],
					}}

				/>
			</div> */}

			{/* <SelectIcon className={style.select} /> */}
		</div>
	);
}
