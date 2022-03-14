// import { createOrganizationRequestBody } from "../../components/form/create-organization";
import { Organization } from "types/organization/types";
import { ApiRoute } from "../../data/enum";
import baseApi from "../index";

const organizationsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getAllOrganizations: build.query<Organization[], number | undefined>({
			query: () => ApiRoute.GetAllOrganization,
			providesTags: (result, _err, userID) => {
				const tags = result
					? [
						...result.map(({ id }) => ({
							type: "Organizations" as const,
							id,
						})),
					]
					: [];

				tags.push({ type: "Organizations", id: "list" });
				userID !== undefined &&
                    tags.push({ type: "Organizations", id: String(userID) });

				return tags;
			},
		}),

		addOrganization: build.mutation<Organization, any>({
			query: (body) => ({
				url: ApiRoute.OrganizationCreate,
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: "Organizations", id: "list" }],
		}),

		updateOrganization: build.mutation({
			query: (body: any) => ({
				url: ApiRoute.OrganizationUpdate,
				method: "PUT",
				body,
			}),
			invalidatesTags: (_res, _err, org) => [
				{ type: "Organizations", id: "list" },
				{ type: "Organizations", id: `org-${org.id}` },
				{ type: "Organizations", id: "selected" },
				{ type: "Assets", id: "User" },
				{ type: "Assets", id: `Org-${org.id}` },
			],
		}),

		deleteOrganization: build.mutation({
			query: (id: string) => ({
				url: ApiRoute.OrganizationDelete,
				method: "DELETE",
				params: { id },
			}),
			invalidatesTags: [{ type: "Organizations", id: "list" }],
		}),

		getOrganization: build.query<Organization, string>({
			query: (id) => ({
				url: ApiRoute.OrganizationInfo,
				method: "GET",
				params: { id },
			}),
			providesTags: (result, _err, id) =>
				result
					? [
						{ type: "Organizations", id: `org-${id}` },
						{ type: "Organizations", id: "selected" },
					]
					: [{ type: "Organizations", id: "selected" }],
		}),
	}),
});

export const {
	useGetAllOrganizationsQuery,
	useAddOrganizationMutation,
	useGetOrganizationQuery,
	useLazyGetOrganizationQuery,
	useDeleteOrganizationMutation,
	useUpdateOrganizationMutation,
} = organizationsApi;
