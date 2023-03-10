import { AssetServerResponse, AssetListItem } from "../../types/asset";
import baseApi from "../index";

const enum AssetEndpoint {
	GetAll = "api/Asset/getAll",
	GetAllUser = "api/Asset/getAllUser",
	getUserAssets = "api/Asset/getAllUserAdmin",

	GetByID = "api/Asset/get",

	LinkOrganization = "api/Asset/addOrgLink",
	LinkUser = "api/Asset/addUserLink",

	UnLinkOrganization = "api/Asset/removeOrgLink",
	UnLinkUser = "api/Asset/removeUserLink",

	ToggleShared = "api/Asset/toggleAssetSharedByDefault",
}

interface LinkOrganizationParameters {
	assetId: number | string;
	orgId: number | string;
}

interface LinkUserParameters {
	assetId: number | string;
	userId: number | string;
}

interface ToggleSharesParams {
	assetId: number | string;
	passedOrgID: number | string;
}

const assetApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getUserAssets: build.query<AssetServerResponse[], string | number>({
			query: (userId) => ({
				url: AssetEndpoint.getUserAssets,
				method: "GET",
				params: { userId },
			}),
			providesTags: (result) =>
				result
					? [
						...result.map(({ id }) => ({ type: "Assets" as const, id })),
						{ type: "Assets", id: "User" },
					]
					: [{ type: "Assets", id: "User" }],
		}),

		getAllAssets: build.query<AssetListItem[], string>({
			query: (orgId) => ({
				url: AssetEndpoint.GetAll,
				method: "GET",
				params: { orgId },
			}),
			providesTags: (_result, _error, id) => [
				{ type: "Assets", id: `Org-${id}` },
			],
		}),

		getAllAssetsOrg: build.mutation<AssetListItem[], string>({
			query: (orgId) => ({
				url: AssetEndpoint.GetAll,
				method: "GET",
				params: { orgId },
			}),
			invalidatesTags: (_result, _error, id) => [
				{ type: "Assets", id: `Org-${id}` },
			],
		}),

		getAllUserAssets: build.query<AssetServerResponse[], void>({
			query: () => AssetEndpoint.GetAllUser,
			providesTags:[{ type: "Assets", id: "User" }]
		}),

		getAssetByID: build.mutation<AssetServerResponse, number>({
			query: (id) => ({
				url: AssetEndpoint.GetByID,
				method: "GET",
				params: { id },
			}),
		}),

		linkAssetToOrg: build.mutation<any, LinkOrganizationParameters>({
			query: (params) => ({
				url: AssetEndpoint.LinkOrganization,
				method: "POST",
				params,
			}),
			invalidatesTags: (_res, _err, arg) => [
				{ type: "Assets", id: `Org-${arg.assetId}` },
			],
		}),

		unlinkAssetToOrg: build.mutation<any, LinkOrganizationParameters>({
			query: (params) => ({
				url: AssetEndpoint.UnLinkOrganization,
				method: "POST",
				params,
			}),
			invalidatesTags: (_res, _err, arg) => [
				{ type: "Assets", id: `Org-${arg.assetId}` },
			],
		}),

		linkAssetToUser: build.mutation<any, LinkUserParameters>({
			query: (params) => ({
				url: AssetEndpoint.LinkUser,
				method: "POST",
				params,
			}),
			invalidatesTags: [{ type: "Assets", id: "User" }],
		}),

		unlinkAssetToUser: build.mutation<any, LinkUserParameters>({
			query: (params) => ({
				url: AssetEndpoint.UnLinkUser,
				method: "POST",
				params,
			}),
			invalidatesTags: [{ type: "Assets", id: "User" }],
		}),

		toggleAssetShared: build.mutation<any, ToggleSharesParams>({
			query: (params) => ({
				url: AssetEndpoint.ToggleShared,
				method: "POST",
				params,
			}),
			invalidatesTags: (res, err, { assetId, passedOrgID }) => [
				{ type: "Assets", id: assetId },
				{ type: "Assets", id: `Org-${passedOrgID}` },
			],
		}),
	}),
});

export const {
	useGetAllAssetsQuery,
	useLazyGetAllAssetsQuery,
	useGetAllAssetsOrgMutation,
	useGetAllUserAssetsQuery,
	useGetAssetByIDMutation,
	useLinkAssetToOrgMutation,
	useUnlinkAssetToOrgMutation,
	useLinkAssetToUserMutation,
	useUnlinkAssetToUserMutation,
	useGetUserAssetsQuery,
	useLazyGetUserAssetsQuery,
	useToggleAssetSharedMutation,
} = assetApi;
