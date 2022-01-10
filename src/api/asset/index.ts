import { AssetServerResponse, NewAssetRequest } from "../../types/asset";
import baseApi from "../index";

const enum AssetEndpoint {
    GetAll = 'api/Asset/getAll',
    GetAllUser = 'api/Asset/getAllUser',
    getUserAssets = 'api/Asset/getAllUserAdmin',

    GetByID = 'api/Asset/get',

    LinkOrganization = 'api/Asset/addOrgLink',
    LinkUser = 'api/Asset/addUserLink',

    UnLinkOrganization = 'api/Asset/removeOrgLink',
    UnLinkUser = 'api/Asset/removeUserLink',

    //* Removed
    // Create =  'api/Asset/create',
    // Update = 'api/Asset/update',
    // Delete = 'api/Asset/delete',
}

interface LinkOrganizationParameters {
    assetId: number | string,
    orgId: number | string
}

interface LinkUserParameters {
    assetId: number | string,
    userId: number | string
}

interface AssetListItem {
    assetId: number | string,
    name: string
}


const assetApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUserAssets: build.query<AssetServerResponse[], string | number >({
            query: (userId) => ({
                url: AssetEndpoint.getUserAssets,
                method: 'GET',
                params: { userId }
            }),
            // providesTags: (result) => result
            //         ? [
            //             ...result.map(({ id }) => ({ type: 'Assets' as const, id })),
            //             { type: 'Assets', id: 'User' },
            //         ]
            //         : [{ type: 'Assets', id: 'User' }],
        }),

        getAllAssets: build.query<AssetListItem[], string>({
            query: (orgId) => ({
                url: AssetEndpoint.GetAll,
                method: 'GET',
                params: { orgId }
            })
        }),

        getAllUserAssets: build.query<any, void>({
            query: () => (AssetEndpoint.GetAllUser)
        }),


        getAssetByID: build.mutation<AssetServerResponse, number>({
            query: (id) => ({
                url: AssetEndpoint.GetByID,
                method: 'GET',
                params: { id }
            }),
        }),

        linkAssetToOrg: build.mutation<any, LinkOrganizationParameters>({
            query: (params) => ({
                url: AssetEndpoint.LinkOrganization,
                method: 'POST',
                params
            })
        }),

        unlinkAssetToOrg: build.mutation<any, LinkOrganizationParameters>({
            query: (params) => ({
                url: AssetEndpoint.UnLinkOrganization,
                method: 'POST',
                params
            })
        }),

        linkAssetToUser: build.mutation<any, LinkUserParameters>({
            query: (params) => ({
                url: AssetEndpoint.LinkUser,
                method: 'POST',
                params
            }),
            // invalidatesTags: [{ type: 'Assets', id: 'User' }],
        }),

        unlinkAssetToUser: build.mutation<any, LinkUserParameters>({
            query: (params) => ({
                url: AssetEndpoint.UnLinkUser,
                method: 'POST',
                params
            })
        }),

    }),
});

export const {
    useGetAllAssetsQuery,
    useGetAllUserAssetsQuery,
    useGetAssetByIDMutation,
    useLinkAssetToOrgMutation,
    useUnlinkAssetToOrgMutation,
    useLinkAssetToUserMutation,
    useUnlinkAssetToUserMutation,
    useGetUserAssetsQuery
} = assetApi;
