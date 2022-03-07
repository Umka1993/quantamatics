import { LoginResponse } from "../../types/loginResponse";
import baseApi from "../index";

export const enum AccountEndpoint {
    Login = "/api/Account/login",
    ResetPasswordMail = "/api/Account/sendPasswordReset",
    ResetPassword = "/api/Account/resetPassword",
    ChangePassword = "/api/Account/changePassword",
    VerifyToken = "/api/Account/verifyToken",
    Capabilities = "/api/Account/capabilities",
    Register = "/api/Account/register",

    Logout = "/api/Account/logout",
    UserInfo = "/api/Account/userInfo",

    GetToken = "/api/Account/getAPIToken",
    GetNameFromAPI = "​/api​/Account​/userNameFromAPIKey​",
}

const accountApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        registerUser: build.mutation({
            query: (body: any) => ({
                url: AccountEndpoint.Register,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Users", id: "list" }],
        }),

        loginUser: build.mutation<
            LoginResponse,
            { email: string; password: string }
        >({
            query: (body) => ({
                url: AccountEndpoint.Login,
                method: "POST",
                body,
            }),
        }),

        verifyToken: build.query<void, { userName: string; token: string }>({
            query: (params) => ({
                url: AccountEndpoint.VerifyToken,
                method: "GET",
                params,
            }),
        }),

        capabilities: build.query<void, void>({
            query: () => AccountEndpoint.Capabilities,
        }),

        //! Not work in backend
        logout: build.mutation<void, void>({
            query: () => ({
                url: AccountEndpoint.Logout,
                method: "POST",
            }),
        }),


        getUserInfo: build.query<void, void>({
            query: () => AccountEndpoint.UserInfo,
        }),

        getToken: build.query<void, void>({
            query: () => AccountEndpoint.GetToken,
        }),

        changePassword: build.mutation<
            void,
            { currentPassword: string; newPassword: string }
        >({
            query: (body) => ({
                url: AccountEndpoint.ChangePassword,
                method: "PUT",
                body,
            }),
        }),

        sendResetPasswordMail: build.mutation<void, string>({
            query: (email) => ({
                url: AccountEndpoint.ResetPasswordMail,
                method: "POST",
                params: { email }
            })
        }),
        resetPassword: build.mutation<
            void,
            { email: string, password: string, token: string  }
        >({
            query: (body) => ({
                url: AccountEndpoint.ResetPassword,
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useVerifyTokenQuery,
    useCapabilitiesQuery,
    useLogoutMutation,
    useGetUserInfoQuery,
    useGetTokenQuery,
    useChangePasswordMutation,
    useResetPasswordMutation,
    useSendResetPasswordMailMutation,
} = accountApi;
