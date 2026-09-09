import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import envConfig from './envConfig';

const api = axios.create({
    baseURL: envConfig.baseURL,
    withCredentials: true, // Important for cookie
});

export class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

api.interceptors.response.use(
    function onFulfilled(response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response.data;
    }, async function onRejected(error: AxiosError) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error



        // Network/server unreachable
        if (!error.response) {
            console.error("Actual axios error:", error);
            return Promise.reject(new Error("Server is not responding"));
        }

        // Handle auth refresh only
        if (error.response.status === 401) {

            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry: boolean };

            if (!originalRequest) {
                return Promise.reject(error);
            }

            if (originalRequest._retry) {
                return Promise.reject(error);
            }

            if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")) {
                return Promise.reject(error);
            }

            try {
                originalRequest._retry = true;
                await api.post("/auth/refresh");
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }


        }

        // Normalize all other errors
        let responseData = error.response.data as { message?: string, errors?: unknown[], success: boolean, statusCode: number };

        const errorData = {
            message: responseData?.message || "An error occurred",
            statusCode: responseData.statusCode || 500,
        }

        return Promise.reject(
            new ApiError(errorData.message, errorData.statusCode)
        );
    }
)

const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
    return api.request<T>(config) as unknown as Promise<T>;
};

export { apiRequest };