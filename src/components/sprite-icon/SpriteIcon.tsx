import { SVGProps } from "react";

interface SpriteIconProps extends SVGProps<SVGSVGElement> {
	label?: string;
	icon: "cross-close" | "plus" | "gears" | "pen";
	sprite?: "sprite";
}

export default function SpriteIcon({
	fill = "currentColor",
	width = "1em",
	height = width,
	icon,
	label,
	sprite = "sprite",
	id,
	...other
}: SpriteIconProps) {
	return (
		<svg
			fill={fill}
			width={width}
			height={height}
			aria-label={id ? undefined : label}
			role={label ? "img" : undefined}
			aria-hidden={label ? undefined : true}
			id={id}
			aria-labelledby={id ? `${id}-title` : undefined}
			{...other}
		>
			{id && label && <title id={`${id}-title`}>{label}</title>}
			<use href={`/img/${sprite}.svg#${icon}`} />
		</svg >
	);
}
