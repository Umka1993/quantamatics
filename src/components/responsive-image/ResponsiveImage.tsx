import { ImgHTMLAttributes } from "react";

type ImageExtension = "jpg" | "png" | "avif" | "webp";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
	extensions: ImageExtension[];
	source: string;
	ratios?: number[];
};

export default function ResponsiveImage({
	extensions,
	source,
	ratios,
	...other
}: Props) {



	function markUpRatio(extension: ImageExtension, isForImg = false) {
		if (ratios) {
			const extraSizes = ratios.map(
				(ratio) => `${source}@${ratio}x.${extension} ${ratio}x`
			)
			return isForImg ? [`${source}.${extension} 1x`, ...extraSizes].join(', ') : extraSizes.join(', ')
		}

		return undefined
	}
	return (
		<picture style={{ display: "inline-flex" }}>
			{extensions.map((extension, index, array) =>
				index === array.length - 1 ? (
					<img
						src={`${source}.${extension}`}
						key={extension}
						srcSet={markUpRatio(extension)}
						{...other}
					/>
				) : (
					<source
						key={extension}
						srcSet={markUpRatio(extension, true)}
						type={`image/${extension}`}
					/>
				)
			)}
		</picture>
	);
}
