
import { AxiosInstance } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { LoginResponse } from '../../types/loginResponse';
import { RootState } from '../../store';
import { AuthorizationActionType } from './reducer';
import { IUser } from '../../types/user';
import { saveToken } from '../../services/token';
import { ApiRoute, AppRoute } from '../../data/enum';
import { Dispatch } from 'redux';

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


export type ThunkActionResult<R = Promise<void>> = ThunkAction<R, RootState, AxiosInstance, AuthorizationActions>;


export const logoutAction = () => (dispatch: Dispatch<AuthorizationActions>) => {
    localStorage.removeItem('id_token')
    localStorage.removeItem('user')
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
                localStorage.setItem("user", JSON.stringify(data.user));
                onFinish()
            })
            .catch(({response}) => {
                console.log(response);
                onError(response.status)
            });

        }; 

