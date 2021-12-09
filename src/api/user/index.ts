import baseApi from "../index";
import { ApiRoute, UserKey, UserRole } from "../../data/enum";
import { IUpdateUser, IUser } from "../../types/user";

const usersApi = baseApi.injectEndpoints({
    endpoints: (build) => ({

        getOrganizationUsers: build.query<IUpdateUser[] | undefined, string>({
            query: (orgId) => ({
                url: ApiRoute.GetUsersByOrgID,
                method: "GET",
                params: { orgId },
            }),
            transformResponse: (users: IUser[]) => {
                if (users) {
                    return users.map((user) => ({
                        ...user, 
                        [UserKey.SubscriptionEndDate]: new Date(user[UserKey.SubscriptionEndDate])
                    }))
                }
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: "Users" as const, id,
                        })),
                        { type: "Users", id: "list" },
                    ]
                    : [{ type: "Users", id: "list" }],
        }),

        getUser: build.query<IUser, string>({
            query: (id) => ({
                url: ApiRoute.GetUserByID,
                method: "GET",
                params: { id },
            }),
        }),

        updateUser: build.mutation<void, IUpdateUser>({
            query: (body) => ({
                url: ApiRoute.UpdateUser,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Users", id: "list" }],
        }),

        updateUserRoles: build.mutation<void, [id: string | number, userRoles: UserRole[]]>({
            query: ([id, userRoles]) => ({
                url: `${ApiRoute.EditRoles}${id}`,
                method: "POST",
                body: { userRoles },
            }),
            invalidatesTags: [{ type: "Users", id: "list" }],
        }),
    }),
});

export const {
    useGetOrganizationUsersQuery,
    useGetUserQuery,
    useUpdateUserMutation,
    useUpdateUserRolesMutation
} = usersApi;
