import { LoginResponse } from "../types/loginResponse";
import { AppRoute } from "../data/enum";
import pendoInitialize from "../services/pendoInitialize";
import { saveToken } from "../services/token";
import { setCookie } from "../services/cookies";
import { useDispatch } from "react-redux";
import { login } from "../store/authorization";
import { useNavigate } from "react-router-dom";
import { InfoMessage } from "../components/info-message/info-message";

export default function useLogin(): (body: LoginResponse) => void {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return ({ user, token }) => {
		pendoInitialize(user);
		const isHaveUserRoles = user.userRoles.length;
		if (!isHaveUserRoles) {
			return navigate(AppRoute.NoRoles, {
				state: {
					headline: "Your user account is in the process of being set up",
					image: "man",
					subtitle:
                        "Please try again later or start a chat session to get help live from someone on our team.",
				} as InfoMessage,
			});
		}
		dispatch(login(user));
		saveToken(token);
		setCookie("user", user.email);
		localStorage.setItem("user", JSON.stringify(user));
		return navigate(AppRoute.Home);
	};
}
