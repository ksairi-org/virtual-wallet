import { setupAxiosInterceptors } from "@react-auth-setup";
import { useAuthStore } from "@react-auth-storage";
import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";

const apiAxiosInstance = axios.create({
  paramsSerializer: { indexes: null },
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL + "/rest/v1/",
  headers: {
    apikey: process.env.EXPO_PUBLIC_SUPABASE_API_KEY,
  },
});

setupAxiosInterceptors({
  axiosInstance: apiAxiosInstance,
  customErrorMiddleware: async (error) => {
    if (error?.response.status === 401) {
      console.log("401 error - trying to refresh session", error);
      const accessToken = await useAuthStore.getState().refreshSession();
      if (accessToken) {
        const originalRequest = error.config;
        // update the token in the original request and retry
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return apiAxiosInstance(originalRequest);
      }
    }
    throw error;
  },
});

// add a second `options` argument here if you want to pass extra options to each generated query
const customAxios = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> =>
  apiAxiosInstance
    .request({
      ...config,
      ...options,
    })
    .then(({ data }) => data)
    .catch((e) => {
      throw e;
    });

type ErrorType<Error> = AxiosError<Error>;

export { customAxios };
export type { ErrorType };
