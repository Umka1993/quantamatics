import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dropToken } from "../../services/token";
import { AppRoute, AuthorizationStatus } from "../../data/enum";
import { IUser } from "../../types/user";
import pendoInitialize from "../../services/pendoInitialize";

export interface AuthState {
    status: AuthorizationStatus;
    user?: IUser;
}

const user: IUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user") as string)
        : undefined;

user && pendoInitialize(user);

const initialState: AuthState = {
    status: user ? AuthorizationStatus.Auth : AuthorizationStatus.Unknown,
    user: user,
};

const authorizationSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<IUser>) {
            state.status = AuthorizationStatus.Auth;
            state.user = action.payload;
        },
        logout(state) {
            dropToken()
            state.status = AuthorizationStatus.NoAuth;
            delete state.user;
            localStorage.clear()
            sessionStorage.clear()
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/"); });
            window.location.href = 'https://hub-k8s.dev.quantamatics.net/hub/logout';
            setTimeout(() => {
                window.location.href = AppRoute.Login;
            }, 800)
        },
    },
});

export const { login, logout } = authorizationSlice.actions;
export default authorizationSlice.reducer;
