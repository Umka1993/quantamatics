import { LoginResponse } from "../types/loginResponse";
import { AppRoute } from "../data/enum";
import pendoInitialize from "./pendoInitialize";
import { saveToken } from "./token";
import { IUser } from "../types/user";
import { setCookie } from "./cookies";

export function processLogin(
        {user, token}:LoginResponse, 
        login: (user: IUser) => void, 
        rememberMe: boolean
        ) : string {
    pendoInitialize(user);

    if (new Date(user.subscriptionEndDate) < new Date()) {
        return AppRoute.Expired;
    }

    if (!user.userRoles.length) {
        return AppRoute.NoRoles;
    }


    login(user)
    saveToken(token);
    setCookie('user', user.email)
    if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(user));
    } else {
        sessionStorage.setItem("user", JSON.stringify(user));
    }
    return AppRoute.Home;

}