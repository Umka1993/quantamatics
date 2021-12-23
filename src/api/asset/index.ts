import { AssetServerResponse, NewAssetRequest, UpdateAssetRequest } from "../../types/asset";
import baseApi from "../index";

const enum AssetEndpoint {
    GetAll = 'api/Asset/getAll',
    GetByID = 'api/Asset/get',
    Create =  'api/Asset/create',
    
    LinkOrganization =  'api/Asset/addOrgLink',
    LinkUser =  'api/Asset/addUserLink',

    Update = 'api/Asset/update',
    Delete = 'api/Asset/delete',
}
interface LinkOrganizationParameters {
    assetId: number | string, 
    orgId: number | string
}

interface LinkUserParameters {
    assetId: number | string, 
    userId: number | string
}

const assetApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllAssets: build.query<any, string>({
            query: (orgId) => ({
                url: AssetEndpoint.GetAll,
                method: 'GET',
                params: {orgId}
            })
        }),

        getAssetsByID: build.query<AssetServerResponse, number>({
            query: (id) => ({
                url: AssetEndpoint.GetByID,
                method: 'GET',
                params: {id}
            })
        }),

        createAssets: build.mutation<AssetServerResponse, NewAssetRequest>({
            query: (body) => ({
                url: AssetEndpoint.Create,
                method: 'POST',
                body
            })
        }),

        linkAssetToOrg: build.mutation<any, LinkOrganizationParameters>({
            query: (params) => ({
                url: AssetEndpoint.LinkOrganization,
                method: 'POST',
                params
            })
        }),

        linkAssetToUser: build.mutation<any, LinkUserParameters>({
            query: (params) => ({
                url: AssetEndpoint.LinkUser,
                method: 'POST',
                params
            })
        }),

        updateAssets: build.mutation<void, UpdateAssetRequest>({
            query: (body) => ({
                url: AssetEndpoint.Update,
                method: 'PUT',
                body
            })
        }),

        deleteAssets: build.mutation<void, number>({
            query: (id) => ({
                url: AssetEndpoint.Delete,
                method: 'DELETE',
                params: {id}
            })
        }),
    }),
});

export const {
    useGetAllAssetsQuery,
    useGetAssetsByIDQuery,
    useCreateAssetsMutation,
    useDeleteAssetsMutation,
    useUpdateAssetsMutation,
    useLinkAssetToOrgMutation,
    useLinkAssetToUserMutation
} = assetApi;