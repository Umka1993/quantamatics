import { AxiosInstance } from "axios";
import { ApiRoute } from "../../data/enum";
import { ThunkAction } from "redux-thunk";
import { RootState } from "store";
import { loginAction } from '../authorization/actions';

type ThunkActionResult<R = Promise<void>> = ThunkAction<
    R,
    RootState,
    AxiosInstance,
    any
>;

export const sendResetPasswordMail =
    (email: string, onFinish: any, onError: any): ThunkActionResult =>
        async (_dispatch, _getState, api) => {
            api
                .post(ApiRoute.ResetPasswordMail, {}, { params: { email } })
                .then((r: any) => {
                    console.log(r);
                    onFinish();
                })
                .catch((e) => {
                    console.log(e);
                    onError();
                });
        };


export const resetPassword =
    (password: string, token: string, email: string,  onFinish: any, onError: any): ThunkActionResult =>
        async (dispatch, _getState, api) => {
            api
                .post(ApiRoute.ResetPassword, {password, token, email})
                .then((r: any) => {
                    console.log(r);
                    dispatch(loginAction({email, password, onFinish, onError}))
                })
                .catch((e) => {
                    console.log(e);
                    onError();
                });

        };