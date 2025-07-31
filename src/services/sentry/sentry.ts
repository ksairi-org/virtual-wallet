import * as Sentry from "@sentry/react-native";

import { IGNORED_ERRORS } from "./constants";
import { reactNavigationIntegration } from "@sentry/react-native";

const convertToNumber = (input: string | undefined): number | undefined => {
  if (input === undefined) {
    return undefined;
  }

  const result = parseFloat(input);

  return isNaN(result) ? undefined : result;
};

const SENTRY_TRACE_SAMPLE_RATE = convertToNumber(
  process.env.EXPO_PUBLIC_SENTRY_TRACE_SAMPLE_RATE,
);

const SDK_BASE_URL = process.env.EXPO_PUBLIC_SDK_BASE_URL || "";

const loginPath = "/auth/login";

const loginStatusFilter = [400, 401];

const setupSentry = (isEnabled: boolean) => {
  const SENTRY_DSN = isEnabled ? process.env.EXPO_PUBLIC_SENTRY_DSN : undefined;

  Sentry.init({
    dsn: SENTRY_DSN,

    integrations: [reactNavigationIntegration()],

    environment: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT,

    enableAutoSessionTracking: true,

    tracePropagationTargets: [SDK_BASE_URL],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,

    ignoreErrors: IGNORED_ERRORS,

    maxBreadcrumbs: 150,
    beforeBreadcrumb: (breadcrumb) => {
      if (breadcrumb.category === "console") {
        return null;
      }

      if (
        breadcrumb.category === "xhr" &&
        (breadcrumb.data?.url.includes("localhost") ||
          breadcrumb.data?.url.includes("api.segment.io") ||
          breadcrumb.data?.url.includes("google.com"))
      ) {
        return null;
      }

      return breadcrumb;
    },
    beforeSend: (event, hint) => {
      type OriginalErrorType = {
        message: string;
        config?: {
          baseURL: string;
          url: string;
          method: string;
          headers?: {
            [key: string]: string;
          };
        };
        response?: {
          status: number;
          data?: unknown;
        };
        isAxiosError?: boolean;
      };

      // Modify or drop the event here

      const error = hint.originalException as OriginalErrorType | undefined;
      const baseURL = error?.config?.baseURL || "";
      const path = error?.config?.url || "";

      // Drop events with errors not in the filter
      if (
        baseURL + path === SDK_BASE_URL + loginPath &&
        loginStatusFilter.includes(error?.response?.status || 0)
      ) {
        return null;
      }

      if (error?.isAxiosError) {
        // Axios errors are not populating the `request` object
        if (!event.request?.url) {
          const request = {
            ...event.request,
            url: baseURL + path,
            method: error.config?.method,
            headers: error.config?.headers,
          };

          event.request = request;
        }

        if (error.response && error.response.data) {
          const contexts = {
            ...event.contexts,
            response: {
              ...event.contexts?.response,
              data: error.response.data,
              status_code: error.response.status,
            },
          };

          event.contexts = contexts;
        }

        event.transaction = event.request.url;

        event.fingerprint = [
          "{{ default }}",
          String(event.request.method),
          String(event.request.url),
          String(error.response?.status),
        ];
      }

      return event;
    },
  });
};

export { setupSentry };
