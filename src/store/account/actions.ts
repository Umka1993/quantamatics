import { AxiosError, AxiosResponse } from "axios";
import { ApiRoute } from "../../data/enum";
import { ThunkActionResult } from "../../types/thunk-actions";


interface IChangePassword {
    currentPassword: string,
    newPassword: string
}

export const changePassword =
        (passwordBody: IChangePassword, onClose: any, setWrongCurrent: any): ThunkActionResult =>
            async (_dispatch, _getState, api) => {
                api
                    .put(ApiRoute.ChangePassword, passwordBody)
                    .then(({ data }: AxiosResponse) => {
                        console.log(data);
                        onClose();
                    })
                    .catch(( response : AxiosError) => {
                        console.log(response);
                        setWrongCurrent("Current password is incorrect");
                    });
            };