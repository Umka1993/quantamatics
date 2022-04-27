import { RefObject, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "../../../../data/enum";
import IApiError from "../../../../types/api-error";
import { InfoMessage } from "../../../../components/info-message/info-message";

const enum LoginError {
	Blocked = "User account locked due to several failed login attempts. Please try again later.",
	Incorrect = "Incorrect email or password",
}


const EXPIRED_STATE = {
	headline: "Your user account has reached its Expiration Date",
	image: "calendar",
	subtitle: `Please contact your organization admin or send us an email at <a href="mailto:support@quantamatics.com">support@quantamatics.com.</a>`,
} as InfoMessage;

export default function useHandleLoginErrors({
	current: form,
}: RefObject<HTMLFormElement>) {
	const [errors, setErrors] = useState<string | undefined>(undefined);
	const navigate = useNavigate();


	function resetError() {
		errors && setErrors(undefined);
	}

	useEffect(() => {
		if (errors && form) {
			form.reportValidity()
		}
	}, [errors, form]);

	function handleResponseError(error: IApiError) {
		const { status, data } = error;

		if (status === 401) {
			switch (data) {
			case "User subscription has ended":
				return navigate(AppRoute.Expired, {
					state: EXPIRED_STATE,
				});

			case "User locked out":
				setErrors(LoginError.Blocked);
				break;
			default:
				setErrors(LoginError.Incorrect);
			}
		}
	}

	return { errors, resetError, handleResponseError };
}
