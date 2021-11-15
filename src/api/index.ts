import { createApi } from "@reduxjs/toolkit/query/react";
import { Organization } from "../types/organization/types";
import { ApiRoute, UserRole } from "../data/enum";
import baseQuery from "./utils/base-query";
import { createOrganizationRequestBody } from "../components/form/create-organization";
import { IUpdateUser, IUser } from "../types/user";

/**
 * {@link https://qmc-api.k8s.dev.quantamatics.net/swagger/index.html | All routes}
 */

const api = createApi({
    reducerPath: "quantamaticsApi",
    baseQuery,
    tagTypes: ["Organizations", "Users"],

    endpoints: (build) => ({
        getAllOrganizations: build.query<Organization[], void>({
            query: () => ApiRoute.GetAllOrganization,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: "Organizations" as const,
                            id,
                        })),
                        { type: "Organizations", id: "list" },
                    ]
                    : [{ type: "Organizations", id: "list" }],
        }),

        addOrganization: build.mutation({
            query: (body: createOrganizationRequestBody) => ({
                url: ApiRoute.OrganizationCreate,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Organizations", id: "list" }],
        }),

        getOrganization: build.query<Organization, string>({
            query: (id) => ({
                url: ApiRoute.OrganizationInfo,
                method: "GET",
                params: { id },
            }),
            providesTags: (result) =>
                result
                    ? [
                        { type: "Organizations", id: result.id },
                        { type: "Organizations", id: "selected" },
                    ]
                    : [{ type: "Organizations", id: "selected" }],
        }),

        getOrganizationUsers: build.query<IUser[], string>({
            query: (orgId) => ({
                url: ApiRoute.GetUsersByOrgID,
                method: "GET",
                params: { orgId },
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({id}) => ({
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
                body: {userRoles},
            }),
            invalidatesTags: [{ type: "Users", id: "list" }],
        }),
    }),
});


export const {
    useGetAllOrganizationsQuery,
    useAddOrganizationMutation,
    useGetOrganizationQuery,
    useGetOrganizationUsersQuery,
    useGetUserQuery,
    useUpdateUserMutation,
    useUpdateUserRolesMutation
} = api;

export default api;
