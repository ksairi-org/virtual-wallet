// src/app/index.tsx
import { Redirect } from "expo-router";
import { useAuthenticationStatus } from "@react-auth-core";

export default function Index() {
  const status = useAuthenticationStatus();
  const isLoggedIn = status === "logged in";

  if (isLoggedIn) {
    return <Redirect href="/(app)/profile" />;
  }

  return <Redirect href="/(auth)/login" />;
}
