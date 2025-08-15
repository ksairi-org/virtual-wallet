import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";

import { getApp } from "@react-native-firebase/app";

import { useCallback, useState } from "react";

import { useAuthStore } from "@react-auth-storage";
import { useUserStore } from "@stores";

const auth = getAuth(getApp());

type LoginData = {
  email: string;
  password: string;
};

type Status = "idle" | "loading" | "error" | "success";

/**
 * @returns functions to be used to login either with username or email or social networks.
 */
const useLoginWithPersistence = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const setKeyValue = useUserStore((state) => state.setKeyValue);
  const [status, setStatus] = useState<Status>("idle");

  const setLoggedUserData = useCallback(
    async (user: FirebaseAuthTypes.User) => {
      setTokens({ accessToken: await user.getIdToken() });
      setKeyValue("id", user.uid);
    },
    [setKeyValue, setTokens],
  );

  const handleLogInSocialNetwork = useCallback(
    async (credentials: FirebaseAuthTypes.AuthCredential) => {
      try {
        setStatus("loading");
        const { user } = await auth.signInWithCredential(credentials);
        setLoggedUserData(user);
        setStatus("success");
        return user;
      } catch (error) {
        console.error("Login failed with social", error);
        setStatus("error");
        throw new Error(error);
      }
    },
    [setLoggedUserData],
  );

  const handleLogInWithEmail = useCallback(
    async ({ email, password }: LoginData) => {
      try {
        setStatus("loading");
        const { user } = await auth.signInWithEmailAndPassword(email, password);
        setLoggedUserData(user);
        setStatus("success");
        return user;
      } catch (error) {
        console.error("Login failed with email:", error);
        setStatus("error");
        throw new Error(error);
      }
    },
    [setLoggedUserData],
  );

  return {
    handleLogInWithEmail,
    handleLogInSocialNetwork,
    status,
  };
};

export { useLoginWithPersistence };
