import axios from "axios";

export function logoutFromJupiter() {
	const JUPITER_LOGOUT = `${process.env.HUB_URL}hub/logout`

	// const logoutWindow : any = window.open(JUPITER_LOGOUT, 'Logout from Jupiter', 'toolbar=1,location=1,directories=1,status=1,menubar=1,scrollbars=1,resizable=1');
	// setTimeout(() => {
	//         logoutWindow.blur();
	//         logoutWindow.close();
	//     }, 6000)

	const user_logout = axios.get(JUPITER_LOGOUT, { withCredentials: true });
	localStorage.removeItem('jupiter-logged');
}
