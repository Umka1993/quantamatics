import s from "./graph.module.scss";
import { HTMLAttributes } from "react";
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

export default function Graph({ className, coefficient, ...other }: Props) {

	return (<div className={classNames(s.root, className)} {...other}>

		<Line options={{
			responsive: true,
			plugins: {
				legend: {
					display: false
				},
				title: {
					display: true,
					text: 'Actual Quarter Analysis',
					font: {
						family: '"Nunito", system-ui, sans-serif',
						// size: 8
					},
					color: 'hsl(208, 100%, 22%)',

				},
			},
			scales: {
				x: {
					grid: {
						display: false,
					},
				}
			}
		}} data={{
			labels: ['2020 W26', '', '', '2020 W31', '2020 W36', '2020 W41', '2020 W44', '2020 W47', '2020 W52', '2021 W5'],
			datasets: [
				{
					label: 'Panel YoY',
					data: [0, 8, 2, 4, -2, 5, -1, 7, 0, 6, 3, 4, -4, 9, 4, -2, -8, 9, -24, -6, 0, 12, 4, 2, 10, 10, 6, 0, 6, 4],
					borderColor: 'hsl(256, 93%, 70%)',
					backgroundColor: 'hsl(256, 93%, 70%)',
				},
				{
					label: 'Panel YoY',
					data: [1, 4],
					borderColor: 'rgb(53, 162, 235)',
					backgroundColor: 'rgba(53, 162, 235, 0.5)',
				},
			],
		}} />


		{/* <img src={MarkPNG} alt="" className={s.mark} width={92} height={20} /> */}
	</div >)
}





