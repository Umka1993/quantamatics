import { ApiRoute } from '../../data/enum';
import { IUpdateUser } from '../../types/user';
import { ThunkActionResult } from '../../types/thunk-actions';
import { requireAuthorization } from '../authorization/actions';

export const updateUser =
    ({ newUserData, onFinish, setEmailError }: any): ThunkActionResult =>
        async (dispatch, getState, api) => {
            api
            .post<IUpdateUser>(ApiRoute.UpdateUser, newUserData)
            .then(({ data }: any) => {

                if (newUserData.id === getState().auth.user?.id) {
                    dispatch(requireAuthorization(newUserData))

                    localStorage.getItem('user') ? localStorage.setItem('user', JSON.stringify(newUserData)) :sessionStorage.setItem('user', JSON.stringify(newUserData))
                }

                dispatch(updateRoles(newUserData.id, newUserData.userRoles, onFinish))
            })
            .catch(({ response: { data } }) => {
                if (data.includes(" already taken")) {
                    setEmailError("The user with such email already exists");
                }
            });

        }; 


export const updateRoles =
        (id: number, userRoles: any, onFinish: any): ThunkActionResult =>
            async (_dispatch, _getState, api) => {
                api.post(`${ApiRoute.EditRoles}${id}`, {userRoles})
                .then(({ data }: any) => {        
                    onFinish();
                })
            }; 

