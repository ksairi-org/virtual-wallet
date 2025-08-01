import { useLoginWithPersistence } from "@react-auth-core";
import { firebase } from "@react-native-firebase/auth";
import { useCallback } from "react";

type AppleLoginParameters = {
  idToken: string;
  nonce: string;
};

/**
 * @returns A function that logs in with a Apple token and nonce and persists
 *          the authentication tokens. If the login is successful, it
 *          will persist the tokens and return the data.
 * `idToken` The idToken returned from Apple
 * `nonce` The nonce returned from Apple
 */
const useAppleLoginWithPersistence = () => {
  const { handleLogInSocialNetwork } = useLoginWithPersistence();

  const handleAppleLoginWithPersistence = useCallback(
    async ({ idToken, nonce }: AppleLoginParameters) => {
      const appleCredential = firebase.auth.AppleAuthProvider.credential(
        idToken,
        nonce,
      );
      handleLogInSocialNetwork(appleCredential);
    },
    [handleLogInSocialNetwork],
  );

  return { handleAppleLoginWithPersistence };
};

export type { AppleLoginParameters };
export { useAppleLoginWithPersistence };
