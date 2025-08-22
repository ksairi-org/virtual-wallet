import { CONFIRM_EMAIL_URL, RESET_PASSWORD_URL } from "@constants";
import { NavigationContainerRef } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import * as Linking from "expo-linking";

const useDetectDeepLinkingWithHash = (
  navigationRef: React.RefObject<
    NavigationContainerRef<ReactNavigation.RootParamList>
  >,
) => {
  useEffect(() => {
    const handleURL = (event: { url: string }) => {
      if (event.url.includes(RESET_PASSWORD_URL)) {
        navigationRef.current?.navigate("ResetPasswordScreen", {
          url: event.url,
        });
        return;
      }

      if (event.url.includes(CONFIRM_EMAIL_URL)) {
        navigationRef.current?.navigate("LoginScreen", {
          url: event.url,
        });
        return;
      }
    };

    const subscription = Linking.addEventListener("url", handleURL);

    return () => {
      subscription?.remove();
    };
  }, [navigationRef]);

  const handleNavigationReady = useCallback(async () => {
    const initialUrl = await Linking.getInitialURL();

    if (initialUrl?.includes(RESET_PASSWORD_URL)) {
      navigationRef.current?.navigate("ResetPasswordScreen", {
        url: initialUrl,
      });
    }
    if (initialUrl?.includes(CONFIRM_EMAIL_URL)) {
      navigationRef.current?.navigate("LoginScreen", {
        url: initialUrl,
      });
    }
  }, [navigationRef]);

  return {
    handleNavigationReady,
  };
};

export { useDetectDeepLinkingWithHash };
