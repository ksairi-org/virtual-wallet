import { useCallback } from "react";

//import { useLoginContinue } from "@utility-nyc/react-query-sdk";
import { useAuthStore } from "@react-auth-storage";

//type UseLoginContinueReturn = ReturnType<typeof useLoginContinue>;
type LoginContinueData = Parameters<
  UseLoginContinueReturn["mutateAsync"]
>[0]["data"];

/**
 * @returns function to be verified with a code and signature sent by Email
 */
const useLoginContinueWithPersistence = () => {
  //const { mutateAsync, ...mutationMetadata } = useLoginContinue();
  const setTokens = useAuthStore((state) => state.setTokens);

  const handleLogIn = useCallback(
    async ({ code, signature, ...rest }: LoginContinueData) => {
      //const { data } = await mutateAsync({
      //        data: { code, signature, ...rest },
      //      });
      //    setTokens(data.tokens);
      //  return data;
    },
    [/*mutateAsync,*/ setTokens],
  );

  return { handleLogIn /*...mutationMetadata*/ };
};

export { useLoginContinueWithPersistence };
