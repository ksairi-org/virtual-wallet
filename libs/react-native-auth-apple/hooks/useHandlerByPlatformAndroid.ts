import type { HandleByPlatformResponse } from "../types";

import { useCallback } from "react";

import { appleAuthAndroid } from "@invertase/react-native-apple-authentication";
import { v4 as uuid } from "uuid";

import { AppleSignInError } from "../types";
/**
 * Hook to handle Apple sign-in on Android.
 *
 * This hook will check if the user is already authenticated, and if not,
 * it will prompt the user to sign-in with Apple.
 *
 * If the user is authenticated, it will return the user's email and
 * an `idToken` from the authentication response.
 *
 * If the user is not authenticated, it will throw an `AppleSignInError`.
 * @returns A promise that resolves to an object with the following properties:
 * - `idToken`: The authentication token returned by Apple.
 * - `nonce`: The nonce returned by Apple.
 * - `platform`: The platform on which the sign-in is being performed.
 * - `email`: The user's email address.
 */
const useHandlerByPlatformAndroid = () =>
  useCallback(async (): Promise<HandleByPlatformResponse> => {
    // Generate secure, random values for state and nonce
    const rawNonce = uuid();
    const state = uuid();

    if (
      !process.env.EXPO_PUBLIC_APPLE_CLIENT_ID ||
      !process.env.EXPO_PUBLIC_APPLE_CALLBACK
    ) {
      throw new AppleSignInError(
        "CONFIGURATION_ERROR",
        "No APPLE_CLIENT_ID or APPLE_CALLBACK",
      );
    }

    // Configure the request
    appleAuthAndroid.configure({
      // The Service ID you registered with Apple
      clientId: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID,

      // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
      // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
      redirectUri: process.env.EXPO_PUBLIC_APPLE_CALLBACK,

      // The type of response requested - code, id_token, or both.
      responseType: appleAuthAndroid.ResponseType.ALL,

      // The amount of user information requested from Apple.
      scope: appleAuthAndroid.Scope.ALL,

      // Random nonce value that will be SHA256 hashed before sending to Apple.
      nonce: rawNonce,

      // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
      state,
    });

    // Open the browser window for user sign in
    const response = await appleAuthAndroid.signIn();

    console.log("response", response);

    const idToken = response.id_token;
    const nonce = response.nonce;

    if (!idToken || !nonce) {
      throw new AppleSignInError("SIGN_IN_FAILED", "no idToken or nonce");
    }
    return {
      idToken,
      nonce,
    };
  }, []);

export { useHandlerByPlatformAndroid };
