import classNames from 'classnames'
import React, { CSSProperties } from 'react'

export type ReactSVGComponent = React.FunctionComponent<
	React.SVGAttributes<SVGElement>
>
interface SVGProps {
	name?: string
	icon: ReactSVGComponent
	style?: CSSProperties
	className?: string
	onClick?: () => void
}

export const SVG: React.FunctionComponent<SVGProps> = (props) => {
	const classes = classNames('icon', props.className)
	return (
		<props.icon
			onClick={props.onClick}
			style={props.style}
			className={classes}
		/>
	)
}

export default SVG
