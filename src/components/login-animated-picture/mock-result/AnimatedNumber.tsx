import { animated, config, useSpring } from '@react-spring/web';
import { HTMLProps, useState } from 'react';

type Props = HTMLProps<HTMLElement> & {
	value: number;
}
export default function AnimatedNumber({ className, value }: Props) {

	const { number } = useSpring({
		reset: true,
		from: { number: 0 },
		number: value,
		delay: 200,
		config: config.molasses,
		// onRest: (test) => { test.value.number = 200 },
	})

	return <animated.dd className={className}>
		{number.to(value => value.toFixed(2))}
	</animated.dd>
}
