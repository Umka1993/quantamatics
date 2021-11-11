import { ApiRoute } from '../../data/enum';
import { IUpdateUser } from '../../types/user';
import { ThunkActionResult } from '../../types/thunk-actions';

export const updateUser =
    ({ newUserData }: any): ThunkActionResult =>
        async (dispatch, getState, api) => {
            api
            .post<IUpdateUser>(ApiRoute.UpdateUser, newUserData)
            .then(({ data }: any) => {

                // if (newUserData as IUpdateUser).id

                console.log(getState);
                console.log(getState());
                console.log(newUserData);
                
                
                
                // console.log(data);
                // dispatch(requireAuthorization(data.user));
                // saveToken(data.token);
                // onFinish(data.user)
            })
            .catch(({response}) => {
                // console.log(response);
                // onError(response.status)
            });

        }; 


      /*   .post("/api/Admin/updateUser", newUserData)
        .then((r: any) => {

            network.post(`/api/Admin/editRoles/${user.id}`, { userRoles: userRoles })
                .then((r: any) => {
                    if (loggedId === user.id) {
                        dispatch(requireAuthorization(newUserData))
                        storage === 'local'
                            ? localStorage.setItem('user', JSON.stringify(newUserData))
                            : sessionStorage.setItem('user', JSON.stringify(newUserData))
                    }

                    onSubmit(newUserData);



                    onClose();
                })

        }) */