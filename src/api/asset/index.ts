import { AssetServerResponse, NewAssetRequest, UpdateAssetRequest } from "../../types/asset";
import baseApi from "../index";

const enum AssetEndpoint {
    GetAll = 'api/Asset/getAll',
    GetByID = 'api/Asset/get',
    Create =  'api/Asset/create',
    AddLink =  'api/Asset/AddLink',
    Update = 'api/Asset/update',
    Delete = 'api/Asset/delete',
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

        addAssetsLink: build.mutation<any, void>({
            query: (body) => ({
                url: AssetEndpoint.AddLink,
                method: 'POST',
                body
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
    useUpdateAssetsMutation
} = assetApi;
