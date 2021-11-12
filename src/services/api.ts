import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiRoute } from '../data/enum';
import { getToken } from './token';

const REQUEST_TIMEOUT = 5000;

export const createAPI = (
): AxiosInstance => {
    const api = axios.create({
        baseURL: ApiRoute.Base,
        timeout: REQUEST_TIMEOUT,
    });

    api.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            const token = getToken();

            if (token && config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
                config.headers['Accept'] = 'application/json';
                config.headers['Content-Type'] = 'application/json';
            }

            return config;
        },
    );

    return api;
};
