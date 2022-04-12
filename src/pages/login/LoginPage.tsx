import LoginForm from "./form/LoginForm";
import style from "./login-page.module.scss";
import LoginPicture from "./login-picture/LoginPicture";

export default function LoginPage() {
	return (
		<main className={style.root}>
			<LoginForm className={style.form} />
			<LoginPicture className={style.side} />
		</main>
	);
}
