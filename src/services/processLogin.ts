import { LoginResponse } from "../types/loginResponse";
import { AppRoute } from "../data/enum";
import pendoInitialize from "./pendoInitialize";
import { saveToken } from "./token";
import { IUser } from "../types/user";

export function processLogin(
        {user, token}:LoginResponse, 
        login: (user: IUser) => void, 
        redirect: (path: string) => void, 
        rememberMe: boolean
        ) {
    pendoInitialize(user);
    if (new Date(user.subscriptionEndDate) > new Date()) {

        login(user)
        saveToken(token);
        if (rememberMe) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            sessionStorage.setItem("user", JSON.stringify(user));
        }
        redirect(AppRoute.Home);
    } else {
        redirect(AppRoute.Expired);
    }
}