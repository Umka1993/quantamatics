import axios from "axios";

export function logoutFromJupiter() {
	const JUPITER_LOGOUT = `${import.meta.env.VITE_HUB_URL}hub/logout`

	axios.get(JUPITER_LOGOUT, { withCredentials: true });
	localStorage.removeItem('jupiter-logged');
}
