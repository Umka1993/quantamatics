import style from "./screenshot.module.scss";
import { HTMLAttributes, useCallback } from "react";
import classNames from "classnames";
import ResponsiveImage from "../../responsive-image/ResponsiveImage";

type Props = HTMLAttributes<HTMLDivElement> & {
	coefficient?: number;
};
const BLUE_BARS = [65, 46, 50, 42, 44, 50, 64, 50, 46, 77, 52, 67];
const PURPLE_BARS = [28, 38, 40, 46, 78, 53, 4, 102, 49, 72]

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
				alt="Screenshot of App"
				height={401}
				width={712}
				className={style.image}
			/>

			<svg
				className={style.graph}
				width={516}
				height={180}
				viewBox="0 0 516 180"
				fill="none"
			>

				<g fill="#8FD3FF">
					{renderBars(BLUE_BARS, 1.1 - coefficient)}
				</g>

				<g fill="#D9D5F3">
					{renderBars(PURPLE_BARS, coefficient + 0.4, 105)}
				</g>
			</svg>
		</div>
	);
}
