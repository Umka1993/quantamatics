import { animated, config, SpringValue, useSpring } from '@react-spring/web';
import { HTMLProps, useState } from 'react';

// export default function animateValue(obj: Element, start: number, end: number, duration: number) {
// 	let startTimestamp = null;
// 	const step = (timestamp) => {
// 		if (!startTimestamp) startTimestamp = timestamp;
// 		const progress = Math.min((timestamp - startTimestamp) / duration, 1);
// 		obj.innerHTML = Math.floor(progress * (end - start) + start);
// 		if (progress < 1) {
// 			window.requestAnimationFrame(step);
// 		}
// 	};
// 	window.requestAnimationFrame(step);
// }

type Props = HTMLProps<HTMLElement> & {
	value: number;
}
export default function AnimatedNumber({ className, value }: Props) {
	const [number, setNumber] = useState(value)

	const spring = useSpring({
		reset: true,
		from: { number: 0 },
		number,
		delay: 200,
		config: config.molasses,
		// onRest: () => {number => {
		// 	console.log(`x: ${x}`);
		// 	console.log(`y: ${y}`);
		// })

		// console.log()
		// },
	})

	// const props = useSpring({ from: { total: 0 }, total: number })


	return <animated.dd className={className}>
		{spring.number.to(value => value.toFixed(2))}
	</animated.dd>
}
