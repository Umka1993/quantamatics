import { LoginForm } from "../../components/form";
import style from "./login-page.module.scss";
import LoginPicture from "./login-picture/LoginPicture";


export default function LoginPage() {
	return <main className={style.root}>


		<LoginForm />

		<LoginPicture  className={style.side}/>
	</main>
}
