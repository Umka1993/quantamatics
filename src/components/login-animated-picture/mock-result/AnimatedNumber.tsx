import { animated, config, useSpring } from "@react-spring/web";
import { HTMLProps, useDeferredValue, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";

type Props = HTMLProps<HTMLElement> & {
	value: number;
	coefficient?: number;
};

export default function AnimatedNumber({ className, value, ...other }: Props) {
	const number = useDebounce(value, 1000)
	// const [number, setNumber] = useState(value);

	// const number = useDeferredValue(value)

	const props = useSpring({
		from: { number: 0 },
		number,
		delay: 0,
		config: config.molasses,
	});

	return (
		<dd className={className} {...other}>
			<animated.span >
				{props.number.to((value) => value.toFixed(2))}
			</animated.span>
			%
		</dd>
	);
}
