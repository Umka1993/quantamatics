import baseApi from "../index";

const enum AssetEndpoint {
    GetAll = '/api/Asset/getAll',
    GetByID = '/api/Asset/get',
    Create = '​/api​/Asset​/create',
    AddLink = '/api/Asset/AddLink',
    Update = '​/api​/Asset​/update',
    Delete = '/api/Asset/delete'
}


const assetApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllAssets: build.query<any, void>({
            query: () => AssetEndpoint.GetAll
        }),

        getAssetsByID: build.query<number, void>({
            query: (id) => ({
                url: AssetEndpoint.GetByID,
                method: 'GET',
                params: {id}
            })
        }),

        createAssets: build.mutation<any, void>({
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

        updateAssets: build.mutation<any, void>({
            query: (body) => ({
                url: AssetEndpoint.Update,
                method: 'PUT',
                body
            })
        }),

        deleteAssets: build.mutation<number, void>({
            query: (id) => ({
                url: AssetEndpoint.Update,
                method: 'DELETE',
                params: {id}
            })
        }),
    }),
});

export const {
    useGetAllAssetsQuery,
    useGetAssetsByIDQuery,
} = assetApi;
