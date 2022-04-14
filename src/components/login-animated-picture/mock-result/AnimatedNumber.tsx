import { animated, config, useSpring } from "@react-spring/web";
import { HTMLProps } from "react";

type Props = HTMLProps<HTMLElement> & {
	value: number;
};

export default function AnimatedNumber({ className, value, ...other }: Props) {
	const { number } = useSpring({
		from: { number: 0 },
		number: value,
		delay: 400,
		config: config.molasses,
	});

	return (
		<dd className={className} {...other}>
			<animated.span >
				{number.to((value) => value.toFixed(2))}
			</animated.span>
			%
		</dd>
	);
}
