import style from "./screenshot.module.scss";
import { HTMLAttributes, useCallback } from "react";
import classNames from "classnames";
import ResponsiveImage from "../../responsive-image/ResponsiveImage";
import { ReactComponent as SelectIcon } from './assets/select.svg'
// import SelectImage from './assets/select.png'

type Props = HTMLAttributes<HTMLDivElement> & {
	coefficient?: number;
};
const BLUE_BARS = [65, 46, 50, 42, 44, 50, 64, 50, 46, 77, 52, 67];
const PURPLE_BARS = [28, 38, 40, 46, 78, 53, 4, 102, 49, 72]
const RED_BARS = [-5, -2, -4, -1, 15, 3, -42, 25, -2, 5]

export default function Screenshot({
	className,
	coefficient = 1,
	...other
}: Props) {

	const renderBars = useCallback((bars: number[], coefficient: number, start = 9) => bars.map(function (bar, index) {
		const height = bar * coefficient;
		return (
			<rect
				width={7}
				height={Math.abs(height)}
				x={start + index * (7 + 36)}
				y={height > 0 ? (121 - height) : 122}
				key={`${bar}-${index}`}
			/>
		)
	}), [])

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

			<svg
				className={style.graph}
				width={500}
				height={180}
				viewBox="0 0 500 180"
				fill="none"
			>

				<g fill="#8FD3FF">
					{renderBars(BLUE_BARS, 1.1 - coefficient)}
				</g>

				<g fill="#D9D5F3">
					{renderBars(PURPLE_BARS, coefficient, 105)}
				</g>

				<g fill="#FFE8EC">
					{renderBars(RED_BARS, 2.2 - coefficient, 87)}
				</g>
			</svg>
			{/* <img src={SelectImage} alt="" width={112} height={69} className={style.select} /> */}
			<SelectIcon className={style.select} />
		</div>
	);
}
