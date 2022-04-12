import style from "./login-animated-picture.module.scss";
import MockResult from "./mock-result/MockResult";
import Graph from "./graph/Graph";

export default function LoginAnimatedPicture() {
	return (
		<div role="img" className={style.wrap} aria-label="Mock Example">
			{/* <Graph spring={props} /> */}
			<MockResult aria-hidden />
		</div>
	);
}
