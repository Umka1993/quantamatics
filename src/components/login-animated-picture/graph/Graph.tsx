import { ReactComponent as Vector } from './vector.svg';
import s from './graph.module.scss';
import { SVGProps } from 'react';
import { SpringValue, animated } from '@react-spring/web';

type Props = SVGProps<SVGSVGElement> & {
	spring: { xys: SpringValue<number[]> }
}

export default function Graph({ spring }: Props) {
	const trans = (x: number, y: number, s: number) => `perspective(400px) rotateX(${x*0.2}deg) rotateY(${y*0.2}deg) scale(${s})`;

	return <animated.svg
		width={392} height={231} aria-hidden style={{
			transform: spring.xys.to(trans),
		}}
		viewBox="0 0 392 231" fill="none"
		className={s.root}
	>
		<Vector />
	</animated.svg>


}
