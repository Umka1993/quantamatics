import { UserWithRoles } from "../../types/user";
import baseApi from "../index";

const enum AdminEndpoint {
	AllUser = "/api/Admin/usersWithRoles",
	EditRole = "/api/Admin/editRoles/",
	GenerateEmail = "/api/Admin/generateEmail/",
	ResetPassword = "/api/Admin/resetUserPassword",
}

const adminHooks = baseApi.injectEndpoints({
	endpoints: (build) => ({
		fetchAllUsers: build.query<UserWithRoles[], void>({
			query: () => AdminEndpoint.AllUser,
			providesTags: [{ type: "Users", id: "all" }],
		}),
	}),
});
export const { useFetchAllUsersQuery } = adminHooks;
