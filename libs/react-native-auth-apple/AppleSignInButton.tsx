import type { AppleSignInError, AppleSignInResponse } from "./types";
import type { AppleButtonProps } from "@invertase/react-native-apple-authentication";

import React, { useCallback } from "react";

import { StyleSheet } from "react-native";

import { AppleButton } from "@invertase/react-native-apple-authentication";

import { useSignInWithApple } from "./hooks";

type AppleSignInButtonProps = Omit<AppleButtonProps, "onPress"> & {
  onPress?: (...params: Parameters<AppleButtonProps["onPress"]>) => void;
  onSuccess?: (response: AppleSignInResponse) => void;
  onError?: (error: AppleSignInError) => void;
};

/**
 * The `AppleSignInButton` component provides a convenient way to sign in
 * with Apple on both Android and iOS devices.
 * @param root0 - AppleSignInButtonProps
 * @param root0.onPress - called when the user presses the button.
 * @param root0.onSuccess - called when the user is successfully signed in.
 * @param root0.onError - called when the user is not successfully signed in.
 * @returns AppleSignInButton
 */
const AppleSignInButton = ({
  onPress,
  onError,
  onSuccess,
  ...rest
}: AppleSignInButtonProps) => {
  const { handleSignInWithApple } = useSignInWithApple({
    onAppleSignInError: onError,
  });

  const handleOnPress = useCallback(
    (...params: Parameters<AppleButtonProps["onPress"]>) => {
      onPress?.(...params);

      handleSignInWithApple().then((response) => {
        if (response) {
          onSuccess?.(response);
        }
      });
    },
    [handleSignInWithApple, onPress, onSuccess],
  );

  return (
    <AppleButton style={styles.appleButton} {...rest} onPress={handleOnPress} />
  );
};

AppleSignInButton.Type = AppleButton.Type;

AppleSignInButton.Style = AppleButton.Style;

const styles = StyleSheet.create({
  appleButton: {
    width: "100%", // You must specify a width
    height: 45, // You must specify a height
  },
});

export { AppleSignInButton };
