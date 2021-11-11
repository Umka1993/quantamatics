import { LoginResponse } from '../../types/loginResponse';
import { AuthorizationActionType } from './reducer';
import { IUser } from '../../types/user';
import { saveToken, dropToken } from '../../services/token';
import { ApiRoute, AppRoute } from '../../data/enum';
import { Dispatch } from 'redux';
import { ThunkActionResult } from '../../types/thunk-actions';

export const requireAuthorization = (authData: IUser) => ({
    type: AuthorizationActionType.Login,
    payload: authData,
} as const);

export const requireLogout = () => ({
    type: AuthorizationActionType.Logout,
} as const);


export type AuthorizationActions =
    | ReturnType<typeof requireAuthorization>
    | ReturnType<typeof requireLogout>;


export const logoutAction = () => (dispatch: Dispatch<AuthorizationActions>) => {
    dropToken()
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    dispatch(requireLogout())
    window.location.href = AppRoute.Login;
}

export const loginAction =
    ({ email, password, onFinish, onError }: any): ThunkActionResult =>
        async (dispatch, _getState, api) => {
            api
            .post<LoginResponse>(ApiRoute.Login, {
                email: email,
                password: password,
            })
            .then(({ data }: any) => {
                console.log(data);
                dispatch(requireAuthorization(data.user));
                saveToken(data.token);
                onFinish(data.user)
            })
            .catch(({response}) => {
                console.log(response);
                onError(response.status)
            });

        }; 

