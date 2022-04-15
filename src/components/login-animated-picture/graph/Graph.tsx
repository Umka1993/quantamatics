import s from "./graph.module.scss";
import { HTMLAttributes } from "react";
import classNames from "classnames";
import ResponsiveImage from "../../responsive-image/ResponsiveImage";
import { animated, config, useSpring } from "@react-spring/web";

type Props = HTMLAttributes<HTMLDivElement> & {};

export default function Graph({ className, ...other }: Props) {

	const { x } = useSpring({
		from: { x: 0 },
		x: 1,
		delay: 2000,
		config: config.molasses,
	});
	return (<div className={classNames(s.root, className)} {...other}>
		<ResponsiveImage
			source="img/login/graph"
			extensions={["avif", "webp", "png"]}
			ratios={[2]}
			alt="Mock Graph"
			width={392} height={231}
			className={s.image}
		/>

		<animated.svg
			width={340}
			height={145}
			viewBox="0 0 340 145"
			fill="none"
			strokeLinecap="round"
			strokeDasharray={800}
			strokeDashoffset={x.to(x => (1 - x) * 800)}
			strokeWidth={1.38}
			// pathLength={100}
			className={s.lines}
		>
			<path d="M5 64.4955L16.0498 37.1782L26.2656 60.9707L38.1494 59.8692L47.9482 64.4955L59.832 56.5647L70.4648 54.1413L80.2637 64.4955L90.688 49.515L101.529 63.394L112.162 50.8368L122.795 58.1068L133.011 54.1413L143.852 71.3248L154.485 37.1782L164.909 55.4632L176.167 68.6812L186.592 88.5083L196.808 37.1782L207.857 141.16L218.49 80.7977L229.332 60.9707L239.339 23.5195L250.18 54.1413L260.605 55.4632L271.029 58.988L282.287 32.5519H292.295L302.719 50.6165L314.811 62.5128L324.818 51.718L335.451 52.8195" stroke="#4DB2F4" />
			<path d="M5 45.5502L16.0498 18.2329L26.2656 42.0254L38.1494 40.9239L47.9482 45.5502L59.832 37.6193L70.4648 35.196L80.2637 45.5502L90.688 30.5697L101.529 44.4487L112.162 31.8915L122.795 39.1615L133.011 35.196L143.852 52.3795L154.485 18.2329L164.909 36.5178L176.167 49.7359L186.592 69.563L196.808 18.2329L207.857 122.215L218.49 61.8524L229.332 42.0254L239.339 4.57422L250.18 35.196L260.605 36.5178L271.029 40.0427L282.287 13.6066H292.295L302.719 31.6712L314.811 43.5675L324.818 32.7727L335.451 33.8742" stroke="#916CFA" />
		</animated.svg>

		{/* <Lines className={s.lines} /> */}
	</div >)
}

// function SVG() {
//   const [flip, set] = useState(false)
//   const { x } = useSpring({
//     reset: true,
//     reverse: flip,
//     from: { x: 0 },
//     x: 1,
//     delay: 200,
//     config: config.molasses,
//     onRest: () => set(!flip),
//   })

//   return (
//     <animated.svg
//       style={{ margin: 20, width: 80, height: 80 }}
//       viewBox="0 0 45 44"
//       strokeWidth="2"
//       fill="white"
//       stroke="rgb(45, 55, 71)"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeDasharray={156}
//       strokeDashoffset={x.to(x => (1 - x) * 156)}>
//       <polygon points={POINTS} />
//     </animated.svg>
//   )
// }
