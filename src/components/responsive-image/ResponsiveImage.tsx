import { ImgHTMLAttributes } from "react";

type ImageExtension = "jpg" | "png" | "avif" | "webp";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
	extensions: ImageExtension[];
	source: string;
};

export default function ResponsiveImage({
	extensions,
	source,
	...other
}: Props) {
	return (
		<picture style={{ display: "inline-flex" }}>
			{extensions.map((extension, index, array) =>
				index === array.length - 1 ? (
					<img
						src={`${source}.${extension}`}
						srcSet={`${source}@2x.${extension} 2x, ${source}@3x.${extension} 3x`}
						{...other}
					/>
				) : (
					<source
						srcSet={`${source}.${extension} 1x, ${source}@2x.${extension} 2x, ${source}@3x.${extension} 3x`}
						type={`image/${extension}`}
					/>
				)
			)}
		</picture>
	);
}
