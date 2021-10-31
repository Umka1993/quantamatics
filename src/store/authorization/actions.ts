
import { AxiosInstance } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { LoginResponse } from '../../types/loginResponse';
import { RootState } from '../../store';
import { AuthorizationActionType } from './reducer';
import { IUser } from '../../types/user';
import { saveToken } from '../../services/token';
import { ApiRoute } from '../../data/enum';

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

export const loginAction =
    ([ email, password, onFinish, onError ]: any): ThunkActionResult =>
        async (dispatch, _getState, api) => {
            api
            .post<LoginResponse>(ApiRoute.Login, {
                email: email,
                password: password,
            })
            .then((r: any) => {
                console.log(r);

                dispatch(requireAuthorization({
                    id: r.data.user.id,
                    email: r.data.user.email,
                    firstName: r.data.user.firstName,
                    lastName: r.data.user.lastName,
                    companyName: r.data.user.companyName,
                    companyRole: r.data.user.companyRole,
                    location: r.data.user.location,
                    subscriptionType: r.data.user.subscriptionType,
                    subscriptionEndDate: r.data.user.subscriptionEndDate,
                    reportPanel: r.data.user.reportPanel,
                    expirationDate: r.data.user.expirationDate,
                    avatar: r.data.user.avatar,
                    userRoles: r.data.user.userRoles,
                    organizationId: r.data.user.organizationId,
                }));

                saveToken(r.data.token);
                localStorage.setItem("user", JSON.stringify(r.data.user));
                onFinish()
            })
            .catch((e) => {
                console.log(e);
                onError(e.response.status)
            });

        }; 

