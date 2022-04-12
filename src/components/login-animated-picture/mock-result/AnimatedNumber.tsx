import { animated, config, useSpring } from "@react-spring/web";
import { HTMLProps } from "react";

type Props = HTMLProps<HTMLElement> & {
	value: number;
};

export default function AnimatedNumber({ className, value }: Props) {
	const { number } = useSpring({
		from: { number: 0 },
		number: value,
		delay: 200,
		config: config.molasses,
	});

	return (
		<animated.dd className={className}>
			{number.to((value) => value.toFixed(2))}
		</animated.dd>
	);
}
