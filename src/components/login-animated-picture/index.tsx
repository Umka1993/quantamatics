import style from "./login-animated-picture.module.scss";
import MockResult from "./mock-result/MockResult";
import Graph from "./graph/Graph";
import Screnshot from "./screen/Screnshot";

export default function LoginAnimatedPicture() {
	return (
		<div role="img" className={style.wrap} aria-label="Mock Example">
			<Screnshot className={style.screen} />
			<Graph className={style.graph} />
			<MockResult className={style.result} aria-hidden />
		</div>
	);
}
