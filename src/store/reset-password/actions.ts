import { ApiRoute } from "../../data/enum";
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


