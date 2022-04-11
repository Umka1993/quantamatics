import { animated, config, SpringValue, useSpring } from '@react-spring/web';
import { HTMLProps, useState } from 'react';

type Props = HTMLProps<HTMLElement> & {
	value: number;
	extra: SpringValue<number[]>;
}
export default function AnimatedNumber({ className, value, extra }: Props) {
	const [number, setNumber] = useState(value)

	const spring = useSpring({
		reset: true,
		from: { number: 0 },
		number,
		delay: 200,
		config: config.molasses,
		onRest: () => {extra.to((x, y) => {
			console.log(`x: ${x}`);
			console.log(`y: ${y}`);
		})

			// console.log()
		},
	})

	// const props = useSpring({ from: { total: 0 }, total: number })


	return <animated.dd className={className}>
		{spring.number.to(value => value.toFixed(2))}
	</animated.dd>
}
