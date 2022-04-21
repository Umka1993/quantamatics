import style from "./screenshot.module.scss";
import { HTMLAttributes, useCallback } from "react";
import classNames from "classnames";
import ResponsiveImage from "../../responsive-image/ResponsiveImage";
import { ReactComponent as SelectIcon } from './assets/select.svg'

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);


import { Bar, Chart } from 'react-chartjs-2';

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

			{/* <Chart type="bar" /> */}
			<div className={style.graph}>
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
						labels: ['2019-2Q', '2019-3Q', '2019-4Q', '2020-1Q', '2020-2Q', '2020-3Q', '2020-4Q', '2021-1Q', '2021-2Q', '2021-3Q', '2021-4Q'],
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
			</div>

			<SelectIcon className={style.select} />
		</div>
	);
}
