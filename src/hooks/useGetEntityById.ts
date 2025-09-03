import {
  UseQueryResult,
  QueryClient,
  UseQueryOptions,
  UndefinedInitialDataOptions,
  DataTag,
  QueryKey,
} from "@tanstack/react-query";
import { customAxios } from "libs/react-query-sdk/custom-axios";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

// Type for field filters
type FieldFilter = string | number | null | undefined;

const useGetEntityById = <
  TData,
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TError = unknown,
>(
  entityHook: (
    params?: TParams,
    options?: {
      query?: Partial<UseQueryOptions<TData, TError, TData>> &
        Pick<UndefinedInitialDataOptions<TData, TError, TData>, "initialData">;
      request?: SecondParameter<typeof customAxios>;
    },
    queryClient?: QueryClient,
  ) => UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  },
  fieldFilters: Partial<Record<keyof TParams, FieldFilter>>,
  options?: {
    query?: Partial<UseQueryOptions<TData, TError, TData>> &
      Pick<UndefinedInitialDataOptions<TData, TError, TData>, "initialData">;
    request?: SecondParameter<typeof customAxios>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} => {
  // Filter out null/undefined values and build params with eq. prefix
  const validEntries = Object.entries(fieldFilters).filter(
    (entry): entry is [string, NonNullable<FieldFilter>] => {
      const [, value] = entry;
      return value !== null && value !== undefined;
    },
  );

  const params =
    validEntries.length > 0
      ? (Object.fromEntries(
          validEntries.map(([key, value]) => [key, `eq.${value}`]),
        ) as TParams)
      : undefined;

  return entityHook(params, options, queryClient);
};

export { useGetEntityById };
