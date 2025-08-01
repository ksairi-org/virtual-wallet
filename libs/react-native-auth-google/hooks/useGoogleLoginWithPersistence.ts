import { useAuthStore } from "@react-auth-storage";
import { useCallback } from "react";

//import { useGoogleMobileLogin } from '@utility-nyc/react-query-sdk';

type UseGoogleLoginReturn = ReturnType<typeof useGoogleMobileLogin>;
type GoogleLoginData = Parameters<
  UseGoogleLoginReturn["mutateAsync"]
>[0]["data"];

/**
 * @returns A function that logs in with a Google token and persists
 *          the authentication tokens. If the login is successful, it
 *          will persist the tokens and return the data.
 * `idToken` The idToken returned from Google
 */
const useGoogleLoginWithPersistence = () => {
  const { mutateAsync, ...mutationMetadata } = {}; //useGoogleMobileLogin();
  const setTokens = useAuthStore((state) => state.setTokens);

  const handleGoogleLoginWithPersistence = useCallback(
    async ({ idToken, ...rest }: GoogleLoginData) => {
      const { data } = await mutateAsync({
        data: { idToken, ...rest },
      });

      setTokens(data.tokens);

      return data;
    },
    [mutateAsync, setTokens],
  );

  return { handleGoogleLoginWithPersistence, ...mutationMetadata };
};

export { useGoogleLoginWithPersistence };
