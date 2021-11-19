import { LoginResponse } from '../../types/loginResponse';
import { IUser } from '../../types/user';
import { saveToken } from '../../services/token';
import { ApiRoute } from '../../data/enum';
import { ThunkActionResult } from '../../types/thunk-actions';
import { login } from '.';



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
                dispatch(login(data.user));
                saveToken(data.token);
                onFinish(data.user)
            })
            .catch(({response}) => {
                console.log(response);
                onError(response.status)
            });

        }; 

