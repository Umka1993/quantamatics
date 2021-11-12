import { IUser } from "../../types/user";
import { AuthorizationStatus } from "../../data/enum";
import { AuthorizationActions } from "./actions";

export const enum AuthorizationActionType {
    Login = "SIGN_IN",
    Logout = "SIGN_OUT",
}

export interface AuthState {
    status: AuthorizationStatus;
    user?: IUser;
}

// ! I think this is not how it should word. Ask @nickreznichuk about it

const user: IUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user") as string)
        : undefined;

const InitialState: AuthState = {
    status: user ? AuthorizationStatus.Auth : AuthorizationStatus.Unknown,
    user: user,
};

function authorizationReducer(
    state = InitialState,
    action: AuthorizationActions
): AuthState {
    switch (action.type) {
        case AuthorizationActionType.Login:
            return {
                ...state,
                status: AuthorizationStatus.Auth,
                user: action.payload,
            };
        case AuthorizationActionType.Logout:
            return { ...state, status: AuthorizationStatus.NoAuth };
        default:
            return state;
    }
}

export default authorizationReducer;
