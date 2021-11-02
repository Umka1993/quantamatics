import { AxiosInstance } from "axios";
import { ApiRoute } from "../../data/enum";
import { ThunkAction } from "redux-thunk";
import { RootState } from "store";

type ThunkActionResult<R = Promise<void>> = ThunkAction<
    R,
    RootState,
    AxiosInstance,
    any
>;

const sendResetPasswordMail =
    (email: string, onFinish: any, onError: any): ThunkActionResult =>
        async (_dispatch, _getState, api) => {
            api
                .post(ApiRoute.ResetPassword, {}, { params: { email } })
                .then((r: any) => {
                    console.log(r);
                    onFinish();
                })
                .catch((e) => {
                    console.log(e);
                    onError();
                });
        };

export default sendResetPasswordMail;
