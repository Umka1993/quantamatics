import { ApiRoute } from "../../data/enum";
import { ThunkActionResult } from "../../types/thunk-actions";

export const registerUser =
    (user: any, onFinish: any, onError: any): ThunkActionResult =>
        async (_dispatch, _getState, api) => {
            api
                .post(ApiRoute.RegisterUser, user)
                .then((r: any) => {
                    console.log(r);
                    onFinish();
                })
                .catch(({ response: { data } }) => {
                    onError(data);
                });
        };
