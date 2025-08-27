import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@react-auth-storage";
import { supabase } from "@react-auth-client";
import axios from "axios";
type RequestInterceptor = AxiosInstance["interceptors"]["request"];
type ResponseInterceptor = AxiosInstance["interceptors"]["response"];

type RequestInterceptorArg = Parameters<RequestInterceptor["use"]>[0];
type SuccessResponseArg = Parameters<ResponseInterceptor["use"]>[0];
type ErrorResponseArg = Parameters<ResponseInterceptor["use"]>[1];

/**
 * all requests, before being sent, will be added an access token in the header's Authorization field, saved in storage.
 * Except for the ones that are for refresh token which will be added a refresh token saved in local storage.
 *
 * all responses:
 * - that contain tokens will save them in local and continue its normal flow
 * - for which `getIsSessionTimeoutError` returns `true` will trigger a refresh request
 * - the rest will continue its normal flow
 * @param options all options
 * @param options.axiosInstance AxiosInstance
 * @param options.customSuccessfulResponseMiddleware An optional function to be called when a successful response is detected; for example, you may want to take the response and store it somewhere else
 * @param options.customRequestMiddleware An optional function to be called before the request is sent; for example, you may want to take the request and modify it
 */
const setupAxiosInterceptors = ({
  axiosInstance,
  customRequestMiddleware,
  customSuccessfulResponseMiddleware,
  customErrorMiddleware,
}: {
  axiosInstance: AxiosInstance;
  customRequestMiddleware?: RequestInterceptorArg;
  customSuccessfulResponseMiddleware?: SuccessResponseArg;
  customErrorMiddleware?: ErrorResponseArg;
}) => {
  axiosInstance.interceptors.request.use(
    async (requestConfig: InternalAxiosRequestConfig<unknown>) => {
      customRequestMiddleware?.(requestConfig);
      const { accessToken } = useAuthStore.getState();
      requestConfig.headers["Authorization"] = `Bearer ${accessToken}`;
      return requestConfig;
    },
    async (error) => {
      console.log("Request error: ", error);
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (fulfilledConfig) => {
      customSuccessfulResponseMiddleware?.(fulfilledConfig);
      return fulfilledConfig;
    },
    async (error) => {
      customErrorMiddleware?.(error);
      if (error?.response.status === 401) {
        console.error("401 error - trying to refresh session", error);
        const {
          data: {
            session: { access_token: accessToken },
          },
          error: refreshSessionError,
        } = await supabase.auth.refreshSession();
        if (!refreshSessionError && accessToken) {
          // update the token in the store
          useAuthStore.getState().setTokens({ accessToken });

          const originalRequest = error.config;
          // update the token in the original request and retry
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        }
      }
      throw error;
    },
  );
};

export { setupAxiosInterceptors };
