import { IUser } from "../../types/user";
import { AuthorizationStatus } from "../../data/enum";
import { AuthorizationActions } from "./actions";


export const enum AuthorizationActionType {
    Login = 'SIGN_IN',
    Logout = 'SIGN_OUT'
}

export interface AuthState {
    status: AuthorizationStatus,
    user?: IUser;
}

const InitialState: AuthState = {
    status: AuthorizationStatus.Unknown,
};

function authorizationReducer(state = InitialState, action: AuthorizationActions): AuthState {
    switch (action.type) {
        case AuthorizationActionType.Login:
            return {...state, status: AuthorizationStatus.Auth, user: action.payload };
        case AuthorizationActionType.Logout:
            return {...state, status: AuthorizationStatus.NoAuth };
        default:
            return state;
    }
}

export default authorizationReducer;

