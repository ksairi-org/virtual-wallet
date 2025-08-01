import type { AppleSignInErrorType, AppleSignInResponse } from "../types";

import { useCallback } from "react";

import { appleAuth } from "@invertase/react-native-apple-authentication";

import { useAppleLoginWithPersistence } from "./useAppleLoginWithPersistence";
import { useHandlerByPlatform } from "./useHandlerByPlatform";
import { AppleSignInError } from "../types";
import { isErrorWithCode } from "../utils";

type UseSignInWithAppleOptions = {
  onAppleSignInError?: (error: AppleSignInError) => void;
};

/**
 * This hook provides a way to sign in with Apple on both Android and iOS devices.
 * The hook returns an object with a function:
 * - `handleSignInWithApple`: A function that signs in with Apple.
 *
 * The `handleSignInWithApple` function returns a promise that resolves to an object
 * with the following properties:
 * - `tokens`: The authentication tokens returned by the server.
 * - `email`: The email of the user that signed in.
 *
 * If the sign-in process fails, the hook will throw an error.
 * @param options The options to use when signing in.
 * @param options.onAppleSignInError The function to call if the sign-in process fails.
 * @returns An object with the function `handleSignInWithApple`.
 */
const useSignInWithApple = ({
  onAppleSignInError,
}: UseSignInWithAppleOptions = {}) => {
  const { handleAppleLoginWithPersistence } = useAppleLoginWithPersistence();

  const { handlerByPlatform } = useHandlerByPlatform();

  const handleSignInWithApple =
    useCallback(async (): Promise<AppleSignInResponse | void> => {
      try {
        const { nonce, idToken } = await handlerByPlatform();

        if (!idToken || !nonce) {
          throw new AppleSignInError(
            "SIGN_IN_FAILED",
            "Something went wrong on handle by platform. No Email",
          );
        }

        await handleAppleLoginWithPersistence({
          idToken,
          nonce,
        });
      } catch (error) {
        console.error("APPLE SIGN IN ERROR--->", error);

        if (error instanceof AppleSignInError) {
          onAppleSignInError?.(error);
        } else if (isErrorWithCode(error)) {
          let errorCode: AppleSignInErrorType = "UNKNOWN";

          switch (error.code) {
            case appleAuth.Error.CANCELED:
              errorCode = "SIGN_IN_CANCELLED";

              break;
            case appleAuth.Error.UNKNOWN:
              errorCode = "UNKNOWN";

              break;
            case appleAuth.Error.INVALID_RESPONSE:
              errorCode = "INVALID_RESPONSE";

              break;
            case appleAuth.Error.NOT_HANDLED:
              errorCode = "NOT_HANDLED";

              break;
            case appleAuth.Error.FAILED:
              errorCode = "SIGN_IN_FAILED";

              break;
          }

          onAppleSignInError?.(
            new AppleSignInError(errorCode, error.message, error),
          );
        } else if (error instanceof Error) {
          // an error that's not related to google sign in occurred
          onAppleSignInError?.(
            new AppleSignInError("UNKNOWN", error.message, error),
          );
        } else {
          onAppleSignInError?.(
            new AppleSignInError("UNKNOWN", "Unknown error"),
          );
        }
      }
    }, [
      handleAppleLoginWithPersistence,
      handlerByPlatform,
      onAppleSignInError,
    ]);

  return { handleSignInWithApple };
};

export { useSignInWithApple };
