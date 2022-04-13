import baseApi from "../index";
import { ApiRoute, UserRole } from "../../data/enum";
import { IUser, IUpdateUser } from "../../types/user";

const usersApi = baseApi.injectEndpoints({
	endpoints: (build) => ({

		getOrganizationUsers: build.query<IUser[], string>({
			query: (orgId) => ({
				url: ApiRoute.GetUsersByOrgID,
				method: "GET",
				params: { orgId },
			}),
			providesTags: [{ type: "Users", id: "list" }],
		}),

		getUser: build.query<IUser, string | number>({
			query: (id) => ({
				url: ApiRoute.GetUserByID,
				method: "GET",
				params: { id },
			}),
			providesTags: [{ type: "SelectedUser", id: "list" }],
		}),

		updateUser: build.mutation<void, IUpdateUser>({
			query: (body) => ({
				url: ApiRoute.UpdateUser,
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: "Users", id: "list" },{ type: "SelectedUser", id: "list" }],
		}),

		updateUserRoles: build.mutation<
			void,
			[id: string | number, userRoles: UserRole[]]
		>({
			query: ([id, userRoles]) => ({
				url: `${ApiRoute.EditRoles}${id}`,
				method: "POST",
				body: { userRoles },
			}),
			invalidatesTags: [{ type: "Users", id: "list" },{ type: "SelectedUser", id: "list" }],
		}),
	}),
});

export const {
	useGetOrganizationUsersQuery,
	useGetUserQuery,
	useLazyGetUserQuery,
	useUpdateUserMutation,
	useUpdateUserRolesMutation,
} = usersApi;
