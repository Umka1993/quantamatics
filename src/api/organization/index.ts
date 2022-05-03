import { ApiRoute } from "../../data/enum";
import { Organization } from "../../types/organization/types";
import baseApi from "../index";
import { createOrganizationRequestBody } from "../../components/form/create-organization";
import filterOrganizationsToUserRole, {
	GetOrganizationProps,
} from "../../services/filterOrganizationsToUserRole";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

const organizationsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getAllOrganizations: build.query<Organization[], GetOrganizationProps | void>({
			query: () => ApiRoute.GetAllOrganization,
			providesTags: tagAllOrganizations,
			transformResponse: filterOrganizationsToUserRole,
		}),

		addOrganization: build.mutation<
			Organization,
			createOrganizationRequestBody
		>({
			query: (body: createOrganizationRequestBody) => ({
				url: ApiRoute.OrganizationCreate,
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: "Organizations", id: "list" }],
		}),

		updateOrganization: build.mutation({
			query: (body: Organization) => ({
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

function tagAllOrganizations(
	result: Organization[] | undefined,
	_err: FetchBaseQueryError | undefined,
	arg?: GetOrganizationProps | void
) {
	const tags = result
		? [
			...result.map(({ id }) => ({
				type: "Organizations" as const,
				id,
			})),
		]
		: [];

	tags.push({ type: "Organizations", id: "list" });
	arg?.id &&
		tags.push({ type: "Organizations", id: String(arg.id) });

	return tags;
}

export const {
	useGetAllOrganizationsQuery,
	useAddOrganizationMutation,
	useGetOrganizationQuery,
	useLazyGetOrganizationQuery,
	useDeleteOrganizationMutation,
	useUpdateOrganizationMutation,
} = organizationsApi;
