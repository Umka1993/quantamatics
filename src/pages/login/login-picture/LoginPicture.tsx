import classNames from "classnames";
import { HTMLProps } from "react";
import style from "./login-picture.module.scss";

import Preview from "./assets/image@2x.png";
import Button from "../../../components/button";

type Props = HTMLProps<HTMLDivElement>

export default function LoginPicture({ className }: Props) {
	return (
		<figure className={classNames(className, style.root)}>
			<img
				className={style.image}
				src={Preview}
				alt="Preview"
				width={726}
				height={437}
			/>

			<figcaption className={style.caption}>
				Integrate out-of-the-box ideas into your research workflow with ease.
				Combine data, assess, and predict intelligently.
				<Button
					variant="transparent-light"
					href="https://www.facteus.com/quantamatics"
					padding="9px 28px"
				>
					Learn More
				</Button>
			</figcaption>
		</figure>
	);
}
