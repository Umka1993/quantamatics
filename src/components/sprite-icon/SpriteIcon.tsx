import React, { FunctionComponent, SVGProps } from 'react'

interface SpriteIconProps extends SVGProps<SVGSVGElement> {
	label?: string
	icon: string
	sprite?: 'sprite';
}


const SpriteIcon: FunctionComponent<SpriteIconProps> = ({
	fill = 'currentColor',
	width = '1em',
	height = width,
	icon,
	label,
	sprite = 'sprite',
	...other
}) => {
	return (
		<svg
			fill={fill}
			width={width}
			height={height}
			aria-label={label}
			role={label ? 'img' : undefined}
			aria-hidden={label ? undefined : true}
			{...other}
		>
			<use href={`/img/${sprite}.svg#${icon}`} />
		</svg>
	)
}

export default SpriteIcon
