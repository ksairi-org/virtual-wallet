import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { getIsRefreshEndpoint } from "./getIsRefreshEndpoint";
// import { getIsObjectAuthTokens } from "./getIsResponseAuthTokens";
// import { getIsSessionTimeoutError } from "./getIsSessionTimeoutError";
// import { getIsUnsuccessfulLoginError } from "./getIsUnsuccessfulLoginError";
import { retrieveSession } from "./retrieveSession";
import { useAuthStore } from "@react-auth-storage";

const IS_WEB =
  typeof window !== "undefined" && typeof sessionStorage !== "undefined";

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
 * @param options.customRequestMiddleware An optional function to be called before the request is sent; for example, you may want to take the request and modify it
 * @param options.customSuccessfulResponseMiddleware An optional function to be called when a successful response is detected; for example, you may want to take the response and store it somewhere else
 * @param options.customErrorMiddleware An optional function to be called when an error is detected; for example, you may want to take the error report it, or store some related data
 * @param options.responseInterceptorSessionTimeoutMiddleware An optional function to be called when a session timeout error is detected; for example, you may want to take the error report it, or store some related data
 * @param options.shouldAutoLogoutOnFailedSessionRefresh Should we automatically log the user out if the session refresh fails?
 * @param options.isAuthServer An optional value to activate server auth on webs that have been updated
 */
const setupAxiosInterceptors = ({
  axiosInstance,
  customRequestMiddleware,
  customSuccessfulResponseMiddleware,
  customErrorMiddleware,
  responseInterceptorSessionTimeoutMiddleware,
  shouldAutoLogoutOnFailedSessionRefresh,
  isAuthServer,
}: {
  axiosInstance: AxiosInstance;
  customRequestMiddleware?: RequestInterceptorArg;
  customSuccessfulResponseMiddleware?: SuccessResponseArg;
  customErrorMiddleware?: ErrorResponseArg;
  responseInterceptorSessionTimeoutMiddleware?: ErrorResponseArg;
  shouldAutoLogoutOnFailedSessionRefresh?: boolean;
  isAuthServer?: boolean;
}) => {
  axiosInstance.interceptors.request.use(
    async (requestConfig: InternalAxiosRequestConfig<unknown>) => {
      const {
        refreshToken: refreshTokenValue,
        accessToken,
        setTokens,
      } = useAuthStore.getState();

      if (isAuthServer && IS_WEB && !refreshTokenValue) {
        const retrievedTokens = await retrieveSession();

        if (retrievedTokens.refreshToken && retrievedTokens.accessToken) {
          setTokens(retrievedTokens);

          requestConfig.headers["Authorization"] =
            `Bearer ${retrievedTokens.accessToken}`;
        }
      }

      if (refreshTokenValue && getIsRefreshEndpoint(requestConfig.url)) {
        requestConfig.headers["Authorization"] = `Bearer ${refreshTokenValue}`;
      } else if (accessToken) {
        requestConfig.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      customRequestMiddleware?.(requestConfig);

      return requestConfig;
    },
  );

  // axiosInstance.interceptors.response.use(
  //   (fulfilledConfig) => {
  //     const maybeTokens = fulfilledConfig.data?.data?.tokens;

  //     if (getIsObjectAuthTokens(maybeTokens)) {
  //       useAuthStore.getState().setTokens(maybeTokens);
  //     }

  //     customSuccessfulResponseMiddleware?.(fulfilledConfig);

  //     return fulfilledConfig;
  //   },
  //   async (error) => {
  //     customErrorMiddleware?.(error);

  //     if (getIsUnsuccessfulLoginError(error)) {
  //       throw error;
  //     }

  //     if (getIsSessionTimeoutError(error)) {
  //       try {
  //         await querifiedRefetchToken();

  //         return axiosInstance.request(error.config);
  //       } catch {
  //         // Consuming application can intercept the session timeout error and handle it as needed
  //         responseInterceptorSessionTimeoutMiddleware?.(error);

  //         if (shouldAutoLogoutOnFailedSessionRefresh) {
  //           useAuthStore.getState().handleLogout();
  //         }

  //         throw error;
  //       }
  //     }

  //     throw error;
  //   },
  // );
};

export { setupAxiosInterceptors };
