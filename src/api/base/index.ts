import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../../services/token';


const baseQuery = fetchBaseQuery({
	baseUrl: import.meta.env.VITE_DATA_API_URL as string,
	prepareHeaders: (headers) => {
		const token = getToken()

		token && headers.set('Authorization', `Bearer ${token}`);

		headers.set('Accept', 'application/json');
		headers.set('Content-Type', 'application/json');

		return headers;
	}
})


export default baseQuery
