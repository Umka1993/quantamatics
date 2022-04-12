import { ReactComponent as Vector } from "./vector.svg";
import s from "./graph.module.scss";
import { SVGProps } from "react";
import classNames from "classnames";

type Props = SVGProps<SVGSVGElement> & {
	// spring: { xys: SpringValue<number[]> }
};

export default function Graph({ className, ...other }: Props) {
	return (
		<svg
			className={classNames(s.root, className)}
			{...other}
			viewBox="0 0 392 231"
			fill="none"
		>
			<Vector />
		</svg>
	);
}
