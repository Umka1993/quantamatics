import style from "./login-animated-picture.module.scss";
import MockResult from "./mock-result/MockResult";
import Graph from "./graph/Graph";
import Screenshot from "./screen/Screenshot";
import usePercentFromCenter from "../../hooks/usePercentFromCenter";
import clamp from "../../services/clamp";
import classNames from "classnames";
import { CSSProperties, HTMLProps } from "react";
import Button from "../button";

export default function LoginAnimatedPicture({
	className,
}: HTMLProps<HTMLDivElement>) {
	// const [ratioX, ratioY] = [0, 0]; //Debug
	const [ratioX, ratioY] = usePercentFromCenter()

	const sum = ratioY + ratioX;

	return (
		<figure
			className={classNames(className, style.root)}
			style={{ "--ratio-x": ratioX, "--ratio-y": ratioY } as CSSProperties}
		>
			<div role="img" className={style.wrap} aria-label="Mock Example">
				<Screenshot
					aria-hidden
					className={style.screen}
					coefficient={sum}
				/>

				<Graph
					className={style.graph}
					width={392}
					height={231}
					aria-hidden
				/>
				<MockResult
					className={style.result}
					aria-hidden
					coefficient={clamp(Math.abs(sum), 0.4, 1)}
				/>
			</div>

			<figcaption className={style.caption}>
				Integrate out-of-the-box ideas into your research workflow with ease.
				Combine data, assess, and predict intelligently.
				<Button
					variant="transparent-light"
					href="https://www.facteus.com/quantamatics"
					padding="9px 28px"
				>
					Learn More
				</Button>
			</figcaption>
		</figure>
	);
}
