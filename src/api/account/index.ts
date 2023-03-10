import { LoginResponse } from "../../types/loginResponse";
import baseApi from "../index";
import { IInviteUserRequestBody } from "../../components/form/add-user";
import { IUser } from "../../types/user";

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
	GetNameFromAPI = "/api/Account/userNameFromAPIKey",
	RestartServer = "/api/User/RestartEnvironment", // Should move this on the backend to Account controller
}

const accountApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		registerUser: build.mutation<IUser, IInviteUserRequestBody>({
			query: (body: IInviteUserRequestBody) => ({
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

		restartServer: build.mutation<void, void>({
			query: () => ({
				url: AccountEndpoint.RestartServer,
				method: "POST",
			})
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
	useRestartServerMutation,
	useChangePasswordMutation,
	useResetPasswordMutation,
	useSendResetPasswordMailMutation,
} = accountApi;
