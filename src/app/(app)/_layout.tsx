import { Redirect, Stack } from "expo-router";
import { useAuthenticationStatus } from "@react-auth-core";
import { useUserStore } from "@stores";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "tamagui";
import { useLingui } from "@lingui/react/macro";

const StyledSafeAreaView = styled(SafeAreaView, {
  flex: 1,
});

export default function AppLayout() {
  const status = useAuthenticationStatus();
  const isLoggedIn = status === "logged in";
  const hasSeenWelcomeScreen = useUserStore(
    (state) => state.hasSeenWelcomeScreen,
  );
  const { t } = useLingui();

  // Redirect to welcome screen if not seen yet
  // Redirect to welcome if not seen yet
  if (isLoggedIn && !hasSeenWelcomeScreen) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <StyledSafeAreaView>
      <Stack>
        <Stack.Screen name="profile" options={{ headerTitle: t`Profile` }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen
          name="ai"
          options={{
            headerTitle: t`AI Assistant`,
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      </Stack>
    </StyledSafeAreaView>
  );
}
