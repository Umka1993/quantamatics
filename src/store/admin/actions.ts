import { ApiRoute, UserRole } from "../../data/enum";
import { IUpdateUser } from "../../types/user";
import { ThunkActionResult } from "../../types/thunk-actions";
import { login } from "../authorization";
import { Dispatch, SetStateAction } from "react";

export const updateUser =
    (
        newUserData: IUpdateUser,
        onFinish: () => void,
        setEmailError: Dispatch<SetStateAction<string | undefined>>
    ): ThunkActionResult =>
        async (dispatch, getState, api) => {
            api.post<IUpdateUser>(ApiRoute.UpdateUser, newUserData)
                .then(({ data }: any) => {
                    if (newUserData.id === getState().auth.user?.id) {
                        const normalizedNewData = {
                            ...newUserData,
                            subscriptionEndDate:
                                newUserData.subscriptionEndDate.toLocaleDateString(),
                        };
                        dispatch(login(normalizedNewData));

                        localStorage.getItem("user")
                            ? localStorage.setItem("user", JSON.stringify(normalizedNewData))
                            : sessionStorage.setItem("user", JSON.stringify(normalizedNewData));
                    }

                    dispatch(updateRoles(newUserData.id, newUserData.userRoles, onFinish));
                })
                .catch(({ response: { data } }) => {
                    if (data.includes(" already taken")) {
                        setEmailError("The user with such email already exists");
                    }
                });
        };

export const updateRoles =
    (id: number, userRoles: UserRole[], onFinish: () => void): ThunkActionResult =>
        async (_dispatch, _getState, api) => {
            api.post(`${ApiRoute.EditRoles}${id}`, { userRoles })
                .then(({ data }: any) => {
                    onFinish();
                });
        };
