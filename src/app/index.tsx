import { Redirect } from "expo-router";
import { useAuthenticationStatus } from "@react-auth-core";
import { useUserStore } from "@stores";

const Index = () => {
  const status = useAuthenticationStatus();
  const isLoggedIn = status === "logged in";
  const hasSeenWelcomeScreen = useUserStore(
    (state) => state.hasSeenWelcomeScreen,
  );

  if (isLoggedIn) {
    if (!hasSeenWelcomeScreen) {
      return <Redirect href="/(onboarding)/welcome" />;
    }
    return <Redirect href="/(app)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
};

export default Index;
