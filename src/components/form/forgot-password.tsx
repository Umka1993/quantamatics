import React, { FunctionComponent, useEffect, useState } from "react";
import { Email } from "../../components/app-input/index";
import Button, { ResetButton } from "../button";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "../../data/enum";
import Form from "./form";

import "./styles/form.scss";
import "./styles/login-page.scss";
import { useSendResetPasswordMailMutation } from "../../api/account";

const ForgotPassword: FunctionComponent = () => {
	const [finish, setFinish] = useState<boolean>(false);
	const [forgotEmail, setForgotEmail] = useState<string>('');
	const [sendEmail, { isSuccess, isError }] = useSendResetPasswordMailMutation();

	const navigate = useNavigate();

	useEffect(() => {
		if (isSuccess) {
			navigate(AppRoute.Success, {
				state: {
					headline: 'A reset password email was sent to the email entered',
					linkText: 'Go to Log in Page',
					link: AppRoute.Login
				}
			});
		}
	}, [isSuccess])

	useEffect(() => {
		isError && setFinish(true)
	}, [isError])

	return (
		<Form
			headline="Forgot Your Password?"
			subtitle='To reset your password, enter the email for your user account'
			onSubmit={() => sendEmail(forgotEmail).unwrap()}
			stopLoading={finish ? finish : undefined}
			className='login-form'
		>
			<div className="login-page__inputs">
				<Email
					externalSetter={setForgotEmail}
					value={forgotEmail}
					name="email"
					placeholder={"Email"}
				/>
			</div>

			<Button className="login-page__btn" type="submit" disabled={!forgotEmail}>
	Send
			</Button>

			<ResetButton className="login-page__btn-cancel" href={AppRoute.Login}>
	Cancel
			</ResetButton>
		</Form>
	);
};

export default ForgotPassword;
