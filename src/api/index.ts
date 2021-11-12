import { createApi } from '@reduxjs/toolkit/query/react'
import { Organization } from '../types/organization/types';
import { ApiRoute } from '../data/enum';
import baseQuery from './utils/base-query';


/**
 * {@link https://qmc-api.k8s.dev.quantamatics.net/swagger/index.html | All routes}
 */

const api = createApi({
    reducerPath: 'quantamaticsApi',
    baseQuery,
    endpoints: (build) => ({
        getAllOrganizations: build.query<Organization[], void>({
            query: () => ApiRoute.GetAllOrganization,
        })
    })
})

export const { useGetAllOrganizationsQuery } = api;

export default api;
