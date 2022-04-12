import { ReactComponent as Vector } from "./vector.svg";
import style from "./screenshot.module.scss";
import { HTMLAttributes, useState } from "react";
import classNames from "classnames";

// public\img\login\screen.avif
export default function Screenshot({
	className,
	...other
}: HTMLAttributes<HTMLDivElement>) {
	const SCREEN_URL = "img/login/screen";
	return (
		<div className={classNames(style.root, className)} {...other}>
			<picture>
				<source
					srcSet={`${SCREEN_URL}.avif 1x, ${SCREEN_URL}@2x.avif 2x, ${SCREEN_URL}@3x.avif 3x`}
					type="image/avif"
				/>
				<source
					srcSet={`${SCREEN_URL}.webp 1x, ${SCREEN_URL}@2x.webp 2x, ${SCREEN_URL}@3x.webp 3x`}
					type="image/webp"
				/>
				<img
					alt="Screenshot of App"
					src={SCREEN_URL + ".png"}
					srcSet={`${SCREEN_URL}@2x.png 2x,
				${SCREEN_URL}@3x.png 3x`}
				/>
			</picture>
			<Vector className={style.graph} />
			{/* <picture>
				<source srcset="/images/cereal-box.webp" type="image/webp" />
				<source srcset="/images/cereal-box.jp2" type="image/jp2" />
				<img src="/images/cereal-box.jxr" type="image/vnd.ms-photo" />
			</picture> */}
			<div className={style.side}></div>
			{/* <svg
				className={classNames(
					// s.root,
					className)

				}
				viewBox="0 0 711 401"
				fill="none"
				{...other}
			>




			</svg>
			*/}
		</div>
	);
}
