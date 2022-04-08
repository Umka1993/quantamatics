import { HTMLProps } from "react";
import style from "./login-picture.module.scss";

import Button from "../../../components/button";

import LoginAnimatedPicture from "../../../components/login-animated-picture";
import classnames from 'classnames'

type Props = HTMLProps<HTMLDivElement>;

export default function LoginPicture({ className }: Props) {

	return (<figure className={classnames(className, style.root)}>
		<LoginAnimatedPicture />

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
	</figure >
	);
}

