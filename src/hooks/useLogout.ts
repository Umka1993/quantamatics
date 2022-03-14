import { useDispatch } from "react-redux";
import { logout } from "../store/authorization";
import { dropToken } from "../services/token";
import { deleteAllCookies } from "../services/cookies";
import { logoutFromJupiter } from "../services/logoutFromJupiter";

export default function useLogout() : () => void {
	const dispatch = useDispatch();
	return () => {
		dropToken();
		dispatch(logout());

		localStorage.clear()
		sessionStorage.clear()
		deleteAllCookies();

		logoutFromJupiter();
	}
}
