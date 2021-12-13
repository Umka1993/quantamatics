import { LoginResponse } from "../types/loginResponse";
import { AppRoute } from "../data/enum";
import pendoInitialize from "../services/pendoInitialize";
import { saveToken } from "../services/token";
import { setCookie } from "../services/cookies";
import { useDispatch } from "react-redux";
import { login } from "../store/authorization";
import { useHistory } from "react-router";

export default function useLogin() : (body: LoginResponse, rememberMe: boolean) => void  {
    const dispatch = useDispatch();
    const history = useHistory();


    return ({user, token}, rememberMe) => {
        pendoInitialize(user);

        if (new Date(user.subscriptionEndDate) < new Date()) {
            return history.push(AppRoute.Expired);
        }
    
        if (!user.userRoles.length) {
            return history.push(AppRoute.NoRoles);
        }
        dispatch(login(user))
        saveToken(token);
        setCookie('user', user.email)
        if (rememberMe) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            sessionStorage.setItem("user", JSON.stringify(user));
        }
        return history.push(AppRoute.Home);
    }
}