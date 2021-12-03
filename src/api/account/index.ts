import { LoginResponse } from '../../types/loginResponse';

import { ApiRoute } from "../../data/enum";
import baseApi from "../index";

const accountApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        registerUser: build.mutation({
            query: (body: any) => ({
                url: ApiRoute.RegisterUser,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Users", id: "list" }],
        }),

        loginUser: build.mutation<LoginResponse, {email: string, password: string }>({
            query: (body) => ({
                url: ApiRoute.Login,
                method: "POST",
                body,
            })
        }),

        verifyToken: build.query<void, {userName: string, token: string}> ({
            query: (params) => ({
                url: ApiRoute.VerifyToken,
                method: "GET",
                params
            })
            
        })
    })
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useVerifyTokenQuery,
} = accountApi;
