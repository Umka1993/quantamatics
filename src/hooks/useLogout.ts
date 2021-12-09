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
    
        window.location.href = 'https://hub-k8s.dev.quantamatics.net/hub/logout';
        setTimeout(() => {
            window.location.href = AppRoute.Login;
        }, 200)
    }
}