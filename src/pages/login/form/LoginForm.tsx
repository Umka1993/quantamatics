import { FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Input, { Password } from "../../../components/input";
import style from "./login-form.module.scss";
import Headline from "../../../components/page-title";
import { useLoginUserMutation } from "../../../api/account";
import useLogin from "../../../hooks/useLogin";
import { AppInfo, AppRoute } from "../../../data/enum";
import Button from "../../../components/button";
import Loader from "../../../components/loader";
import useHandleLoginErrors from "./utils/useHandleLoginErrors";

export default function LoginForm() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const formRef = useRef<HTMLFormElement>(null);

	const [sendLogin, { isLoading }] = useLoginUserMutation();
	const loginProcess = useLogin();
	const { errors, resetError, handleResponseError } = useHandleLoginErrors(formRef);

	const handleSubmit= (evt: FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		sendLogin({ email, password })
			.unwrap()
			.then(loginProcess)
			.catch(handleResponseError);
	};

	return (
		<form
			onSubmit={handleSubmit}
			onInput={resetError}
			noValidate
			className={style.root}
			ref={formRef}
		>
			<header className={style.header}>
				<Headline className={style.title} pageTitle={`Sign in ${AppInfo.Name}`}>
					Sign In
					<img
						src={AppInfo.LogoPath}
						alt={AppInfo.Name}
						width={211}
						height={40}
					/>
				</Headline>
				<p className={style.subtitle}>
					Please. Enter your email and password to get start
				</p>
			</header>

			{isLoading ?
				<Loader className={style.loader} /> :
				<fieldset className={style.inputs}>
					<Input
						placeholder="Email"
						name="email"
						label="Email"
						type="email"
						defaultValue={email}
						externalSetter={setEmail}
						externalErrorID={errors ? "test" : undefined}
						invalid={Boolean(errors)}
						required
					/>

					<Password
						placeholder="Password"
						label="Password"
						defaultValue={password}
						externalSetter={setPassword}
						name="password"
						autoComplete="current-password"
						customError={errors}
						required
					/>
				</fieldset>
			}

			<Link to={AppRoute.ForgotPassword} className={style.forgot}>
				Forgot Password?
			</Link>

			<Button
				className={style.submit}
				disabled={!email || !password}
				type="submit"
				variant="accent"
			>
				Sign In
			</Button>
		</form>
	);
}
