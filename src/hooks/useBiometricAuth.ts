import * as LocalAuthentication from "expo-local-authentication";
import { useCallback } from "react";

const BIOMETRIC_PROMPT_MESSAGE = "Confirm your identity";

export const useBiometricAuth = () => {
  const authenticate = useCallback(async (): Promise<boolean> => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: BIOMETRIC_PROMPT_MESSAGE,
      cancelLabel: "Cancel",
    });
    return result.success;
  }, []);

  return { authenticate };
};
