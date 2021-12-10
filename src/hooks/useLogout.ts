import { useDispatch } from "react-redux";
import { logout } from "../store/authorization";
import { dropToken } from "../services/token";
import { deleteAllCookies } from "../services/cookies";
import { AppRoute } from "../data/enum";

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


function logoutFromJupiter() {
    const JUPITER_LOGOUT = `${process.env.HUB_URL}hub/logout`

    const logoutWindow : any = window.open(JUPITER_LOGOUT, 'Logout from Jupiter', 'toolbar=1,location=1,directories=1,status=1,menubar=1,scrollbars=1,resizable=1');
    setTimeout(() => {
            logoutWindow.blur();
            logoutWindow.close();
        }, 600)
}