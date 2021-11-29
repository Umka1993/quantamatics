import { ApiRoute } from "../../data/enum";
import { loginAction } from '../authorization/actions';
import { ThunkActionResult } from "../../types/thunk-actions";

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
    (password: string, token: string, email: string,  onFinish: any, onError: any, login = true): ThunkActionResult =>
        async (dispatch, _getState, api) => {
            api
                .post(ApiRoute.ResetPassword, {password, token, email})
                .then((r: any) => {
                    console.log(r);
                    login ? dispatch(loginAction({email, password, onFinish, onError})) : onFinish();
                })
                .catch((e) => {
                    console.log(e);
                    onError();
                });

        };