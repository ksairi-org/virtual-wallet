import {
  UseMutationResult,
  QueryClient,
  UseMutationOptions,
  UseMutateFunction,
} from "@tanstack/react-query";
import { customAxios } from "libs/react-query-sdk/custom-axios";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

// Type for field filters
type FieldFilter = string | number | null | undefined;

const useUpdateEntityById = <
  TData,
  TBody extends UseMutateFunction<TData, TError, TBody, unknown>,
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TError = unknown,
>(
  entityMutationHook: (
    options?: UseMutationOptions<
      TData,
      TError,
      { data: TBody; params?: TParams },
      unknown
    > & {
      request?: SecondParameter<typeof customAxios>;
    },
    queryClient?: QueryClient,
  ) => UseMutationResult<
    TData,
    TError,
    { data: TBody; params?: TParams },
    unknown
  >,
  fieldFilters: Partial<Record<keyof TParams, FieldFilter>>,
  options?: UseMutationOptions<TData, TError, TBody, unknown> & {
    request?: SecondParameter<typeof customAxios>;
  },
  queryClient?: QueryClient,
): UseMutationResult<TData, TError, TBody, unknown> => {
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

  const mutation = entityMutationHook(
    {
      ...options,
      mutationFn: options?.mutationFn
        ? async (variables: { data: TBody; params?: TParams }) =>
            options.mutationFn!(variables.data)
        : undefined,
      onMutate: options?.onMutate
        ? (variables: { data: TBody; params?: TParams }) =>
            options.onMutate!(variables.data)
        : undefined,
      onSuccess: options?.onSuccess
        ? (
            data: TData,
            variables: { data: TBody; params?: TParams },
            context: unknown,
          ) => options.onSuccess!(data, variables.data, context)
        : undefined,
      onError: options?.onError
        ? (
            error: TError,
            variables: { data: TBody; params?: TParams },
            context: unknown,
          ) => options.onError!(error, variables.data, context)
        : undefined,
      onSettled: options?.onSettled
        ? (
            data: TData | undefined,
            error: TError | null,
            variables: { data: TBody; params?: TParams },
            context: unknown,
          ) => options.onSettled!(data, error, variables.data, context)
        : undefined,
    },
    queryClient,
  );

  // Transform the mutation to accept just the body instead of { data, params }
  return {
    ...mutation,
    mutate: (
      data: TBody,
      mutateOptions?: Parameters<typeof mutation.mutate>[1],
    ) => {
      return mutation.mutate({ data, params }, mutateOptions);
    },
    mutateAsync: (
      data: TBody,
      mutateOptions?: Parameters<typeof mutation.mutateAsync>[1],
    ) => {
      return mutation.mutateAsync({ data, params }, mutateOptions);
    },
  } as unknown as UseMutationResult<TData, TError, TBody, unknown>;
};

export { useUpdateEntityById };
