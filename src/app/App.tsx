import { RootStackNavigator } from "@navigation";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useRef } from "react";
import { StatusBar, StyleSheet, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../../tamagui.config";
import { SplashView } from "@react-native-splash-view";
import { useCustomFonts } from "./hooks";
import { themes } from "@theme";
import { useDetectDeepLinkingWithHash } from "@hooks";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const splash = require("../../assets/splash.riv");

const SPLASH_FADE_OUT_DURATION_MS = 1000;

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});

const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    retry: 1,
  },
});

const getSplashViewStyle = (isOSThemeDark: boolean) => ({
  backgroundColor: isOSThemeDark
    ? themes.dark["splash-background2"]
    : themes.light["splash-background2"],
});

export default function App() {
  const fontsLoaded = useCustomFonts();
  const colorScheme = useColorScheme();
  const isAppReady = fontsLoaded;
  const isOSThemeDark = colorScheme === "dark";
  const navigationRef =
    useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null);

  const { handleNavigationReady } = useDetectDeepLinkingWithHash(navigationRef);

  return (
    <>
      {!isAppReady ? null : (
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={styles.gestureHandler}>
            <TamaguiProvider
              config={tamaguiConfig}
              defaultTheme={isOSThemeDark ? "dark" : "light"}
            >
              <NavigationContainer
                ref={navigationRef}
                onReady={handleNavigationReady}
              >
                <StatusBar barStyle={"default"} />
                <RootStackNavigator />
              </NavigationContainer>
            </TamaguiProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      )}
      <SplashView
        style={getSplashViewStyle(isOSThemeDark)}
        source={splash}
        fadeOutDuration={SPLASH_FADE_OUT_DURATION_MS}
        fadeOutDelay={2000}
      />
    </>
  );
}
