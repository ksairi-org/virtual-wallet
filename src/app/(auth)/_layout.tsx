// src/app/(auth)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import { useAuthenticationStatus } from "@react-auth-core";

export default function AuthLayout() {
  const status = useAuthenticationStatus();
  const isLoggedIn = status === "logged in";

  // Redirect to home if already logged in
  if (isLoggedIn) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
