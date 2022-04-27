import LoginAnimatedPicture from "../../components/login-animated-picture";
import LoginForm from "./form/LoginForm";
import style from "./login-page.module.scss";

export default function LoginPage() {
	return (
		<main className={style.root}>
			<LoginForm className={style.form} />
			<LoginAnimatedPicture className={style.side} />
		</main>
	);
}
