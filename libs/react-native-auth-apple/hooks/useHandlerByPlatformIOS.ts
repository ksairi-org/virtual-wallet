import { useCallback } from "react";

import { appleAuth } from "@invertase/react-native-apple-authentication";

import { AppleSignInError, AppleSignInResponse } from "../types";

/**
 * Hook to handle Apple sign-in on iOS.
 *
 * This hook will check if the user is already authenticated, and if not,
 * it will prompt the user to sign-in with Apple.
 *
 * If the user is authenticated, it will return the `idToken` from the authentication response.
 *
 * If the user is not authenticated, it will throw an `AppleSignInError`.
 * @returns A promise that resolves to an object with the following properties:
 * - `idToken`: The authentication token returned by Apple.
 * - `nonce`: The nonce returned by Apple.
 */
const useHandlerByPlatformIOS = () =>
  useCallback(async (): Promise<AppleSignInResponse> => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    console.log("appleAuthRequestResponse:", appleAuthRequestResponse);

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    console.log("credentialState:", credentialState);

    // use credentialState response to ensure the user is authenticated
    if (credentialState !== appleAuth.State.AUTHORIZED) {
      throw new AppleSignInError("SIGN_IN_FAILED", "User is not authenticated");
    }

    // user is authenticated
    console.log("user is authenticated");

    const idToken = appleAuthRequestResponse.identityToken;
    const nonce = appleAuthRequestResponse.nonce;

    if (!idToken) {
      throw new AppleSignInError("SIGN_IN_FAILED", "no idToken");
    }

    return {
      idToken,
      nonce,
    };
  }, []);

export { useHandlerByPlatformIOS };
