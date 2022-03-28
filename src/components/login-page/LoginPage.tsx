import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../button";

import { AppRoute } from "../../data/enum";
import { useLoginUserMutation } from "../../api/account";
import IApiError from "../../types/api-error";
import useLogin from "../../hooks/useLogin";
import Input, { Password } from "../input";
import style from "./login-form.module.scss";
import Headline from "../page-title";
import expiredState from "./utils/expiredState";

interface LoginForm extends HTMLFormElement {
	email: HTMLInputElement;
	password: HTMLInputElement;
}

export default function LoginPage() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [errors, setErrors] = useState<string | undefined>(undefined);
	const formRef = useRef<HTMLFormElement>(null);

	const [sendLogin, { isError, isSuccess, isLoading, error, data }] =
		useLoginUserMutation();

	const loginProcess = useLogin();

	const navigate = useNavigate();

	// hide errors on any input
	useEffect(() => {
		errors && setErrors(undefined);
	}, [email, password]);

	const handleLogin = (evt: FormEvent<LoginForm>) => {
		evt.preventDefault();

		const { email, password } = evt.currentTarget;
		sendLogin({ email: email.value, password: password.value }).unwrap();
	};

	const handleResponseError = () => {
		if (isError) {
			const { status, data } = error as IApiError;
			if (status === 401) {
				switch (data) {
				case "User subscription has ended":
					return navigate(AppRoute.Expired, {
						state: expiredState,
					});

				case "User locked out":
					setErrors(
						"User account locked due to several failed login attempts. Please try again later."
					);
					break;
				default:
					setErrors("Incorrect email or password");
				}
			}
		}
	};
	useEffect(handleResponseError, [isError]);

	useEffect(() => {
		if (errors && formRef.current) {
			formRef.current.reportValidity();
		}
	}, [errors, formRef]);

	useEffect(() => {
		if (isSuccess && data) {
			loginProcess(data);
		}
	}, [isSuccess]);

	return (
		<form onSubmit={handleLogin} noValidate className={style.root}>
			<header className={style.header}>
				<Headline className={style.title}>Sign In</Headline>
				<p className={style.subtitle}>Enter your email and password</p>
			</header>

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
				/>
			</fieldset>

			<Link to={AppRoute.ForgotPassword} className={style.forgot}>
				Forgot Password?
			</Link>

			<Button
				className={style.submit}
				disabled={!email || !password}
				type="submit"
			>
				Sign In
			</Button>
			<p className={style.note}>
				Interested in Quantamatics and want to{" "}
				<a
					className='link'
					href="https://www.facteus.com/quantamatics"
					target="_blank"
					rel="noopener noreferrer"
				>
					learn more?
				</a>
			</p>
		</form>
	);
}
