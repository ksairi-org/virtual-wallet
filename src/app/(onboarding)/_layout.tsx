import { Stack } from "expo-router";

const OnboardingLayout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="welcome" />
  </Stack>
);
export default OnboardingLayout;
