import s from "./graph.module.scss";
import { HTMLAttributes, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import ResponsiveImage from "../../responsive-image/ResponsiveImage";
import { animated, config, useSpring } from "@react-spring/web";
import MarkPNG from './mark.png';
import clamp from "../../../services/clamp";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';


ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);


import { Line } from 'react-chartjs-2';

type Props = HTMLAttributes<HTMLDivElement> & {
	coefficient: number;
};

export default function Graph({ className, coefficient = 1, ...other }: Props) {

	const DATA = [0, 8, 2, 4, -2, 5, -1, 7, 0, 6, 3, 4, -4, 9, 4, -2, -8, 9, -24, -6, 0, 12, 4, 2, 10, 10, 6, 0, 6, 4];

	const [data, setData] = useState(DATA);
	const [secondData, setSecondData] = useState<number[]>([]);

	useEffect(() => {
		setData(DATA.map(value => value * coefficient))

		setSecondData(DATA.map(value => (value - 5) * coefficient))
	}, [coefficient])


	return (<div className={classNames(s.root, className)} {...other}>
		<Line
			options={{
				responsive: true,
				maintainAspectRatio: true,
				layout: {
					padding: {
						left: 15,
						right: 15,
						bottom: 20,
						top: 20
					}
				},
				animations: {
					tension: {
						duration: 1000,
						easing: 'linear',
						from: 1,
						to: 0,
						loop: true
					}
				},
				plugins: {
					legend: {
						display: false
					},
					title: {
						display: true,
						text: 'Actual Quarter Analysis',
						fullSize: true,
						font: {
							family: '"Nunito", system-ui, sans-serif',
							// size: 8
						},
						align: 'start',
						color: 'hsl(208, 100%, 22%)',
						padding: {
							top: 0,
							bottom: 20
						}
					},
				},
				scales: {
					x: {
						grid: {
							display: false,
						},
						ticks: {
							autoSkip: true,
							maxTicksLimit: 8
						},
						title: {
							font: {
								weight: "normal",
								size: 2
							}

						},
					},
					y: {
						min: -35,
						max: 20,
						ticks: {
							callback: (value) => `${value}%`
						},
						title: {
							font: {
								size: 4
							}
						},

					}
				}
			}}
			data={{
				labels: ['2020 W26', '2020 W27', '2020 W28', '2020 W29', '2020 W30', '2020 W31', '2020 W32', '2020 W33', '2020 W34', '2020 W35', '2020 W36', '2020 W37', '2020 W38', '2020 W39', '2020 W40', '2020 W41', '2020 W42', '2020 W43', '2020 W44', '2020 W45', '2020 W46', '2020 W47', '2020 W48', '2020 W49', '2020 W50', '2020 W51', '2020 W52', '2021 W1', '2021 W2', '2021 W3'],
				datasets: [
					{
						label: 'Panel YoY',
						data,
						borderColor: 'hsl(256, 93%, 70%)',
						backgroundColor: 'transparent',
					},
					{
						label: 'Panel YoY',
						data: secondData,
						borderColor: 'rgb(53, 162, 235)',
						backgroundColor: 'transparent',
					},
				],
			}}
			width={392}
			height={230}
		/>


		{/* <img src={MarkPNG} alt="" className={s.mark} width={92} height={20} /> */}
	</div >)
}





