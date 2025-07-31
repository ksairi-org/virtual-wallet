import type { LoginOptions } from "@utility-nyc/react-query-sdk";

import { useCallback } from "react";

import { useLogin } from "@utility-nyc/react-query-sdk";
import { useAuthStore } from "@react-auth-storage";

type UseLoginReturn = ReturnType<typeof useLogin>;
type MutationParams = Parameters<UseLoginReturn["mutateAsync"]>[0]["data"];

type ExtraLoginData = Omit<MutationParams, "credential">;

type LoginData = {
  identifier: string;
  password: string;
  options?: LoginOptions;
} & ExtraLoginData;

/**
 * @returns function to be used to login either with username or email
 */
const useLoginWithPersistence = () => {
  const { mutateAsync, ...mutationMetadata } = useLogin();
  const setTokens = useAuthStore((state) => state.setTokens);

  const handleLogIn = useCallback(
    async ({ identifier, password, options }: LoginData) => {
      const { data } = await mutateAsync({
        data: {
          credential: password,
          identifier,
          options,
        },
      });

      setTokens(data.tokens);

      return data;
    },
    [mutateAsync, setTokens],
  );

  return { handleLogIn, ...mutationMetadata };
};

export { useLoginWithPersistence };
