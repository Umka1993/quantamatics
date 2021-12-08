import { LoginResponse } from '../../types/loginResponse';
import baseApi from "../index";

export const enum AccountEndpoint {
    Login = '/api/Account/login',
    ResetPasswordMail = '/api/Account/sendPasswordReset',
    ResetPassword = "/api/Account/resetPassword",
    ChangePassword = '/api/Account/changePassword',
    VerifyToken = '/api/Account/verifyToken',
    Capabilities = '​/api​/Account​/capabilities',
    RegisterUser = '/api/Account/register',
}

const accountApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        registerUser: build.mutation({
            query: (body: any) => ({
                url: AccountEndpoint.RegisterUser,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Users", id: "list" }],
        }),

        loginUser: build.mutation<LoginResponse, {email: string, password: string }>({
            query: (body) => ({
                url: AccountEndpoint.Login,
                method: "POST",
                body,
            })
        }),

        verifyToken: build.query<void, {userName: string, token: string}> ({
            query: (params) => ({
                url: AccountEndpoint.VerifyToken,
                method: "GET",
                params
            })
            
        }),

        capabilities: build.query<void, void> ({
            query: () => (AccountEndpoint.Capabilities)
        })
    })
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useVerifyTokenQuery,
    useCapabilitiesQuery
} = accountApi;
