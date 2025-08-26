import { setupAxiosInterceptors } from "@react-auth-setup";
import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";

const apiAxiosInstance = axios.create({
  paramsSerializer: { indexes: null },
  baseURL: process.env.EXPO_PUBLIC_SUPABASE_OPENAPI_SPEC_URL,
  headers: {
    apikey: process.env.EXPO_PUBLIC_SUPABASE_API_KEY,
  },
});

setupAxiosInterceptors({
  axiosInstance: apiAxiosInstance,
  shouldAutoLogoutOnFailedSessionRefresh: true,
  isAuthServer: true,
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
