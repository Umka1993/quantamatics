import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../../services/token';
import { ApiRoute } from '../../data/enum';


const baseQuery = fetchBaseQuery({ 
    baseUrl: ApiRoute.Base,
    prepareHeaders: (headers) => {
        const token = getToken()

        token && headers.set('Authorization', `Bearer ${token}`);

        headers.set('Accept', 'application/json');
        headers.set('Content-Type', 'application/json');

        return headers;
    }
}) 


export default baseQuery