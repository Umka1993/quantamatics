import { createApi } from "@reduxjs/toolkit/query/react";
import { Organization } from "../types/organization/types";
import { ApiRoute } from "../data/enum";
import baseQuery from "./utils/base-query";
import { createOrganizationRequestBody } from "../components/form/create-organization";

/**
 * {@link https://qmc-api.k8s.dev.quantamatics.net/swagger/index.html | All routes}
 */

const api = createApi({
    reducerPath: "quantamaticsApi",
    baseQuery,
    tagTypes: ["Organizations"],

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
            query: (body : createOrganizationRequestBody) => ({
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
                params: {id}
            }),
            // invalidatesTags: [{ type: "Organizations", id: "list" }],
        })
    }),
});

export const { useGetAllOrganizationsQuery, useAddOrganizationMutation, useGetOrganizationQuery } = api;

export default api;
