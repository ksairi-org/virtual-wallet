import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";

import { getApp } from "@react-native-firebase/app";

import { useCallback, useState } from "react";

import { useAuthStore } from "@react-auth-storage";

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
  const [status, setStatus] = useState<Status>("idle");

  const handleLogInSocialNetwork = useCallback(
    async (credentials: FirebaseAuthTypes.AuthCredential) => {
      try {
        setStatus("loading");
        const { user } = await auth.signInWithCredential(credentials);
        setTokens({ accessToken: await user.getIdToken() });
        setStatus("success");
      } catch (error) {
        console.error("error", error);
        setStatus("error");
        throw new Error(error);
      }
    },
    [setTokens],
  );

  const handleLogInWithEmail = useCallback(
    async ({ email, password }: LoginData) => {
      try {
        setStatus("loading");
        // const userCredential = await auth.signInWithEmailAndPassword(
        //   email,
        //   password,
        // );

        //saveTokens(userCredential);
        setStatus("success");
      } catch (error) {
        console.error("Login failed with email:", error);
        setStatus("error");
      }
    },
    [],
  );

  return {
    handleLogInWithEmail,
    handleLogInSocialNetwork,
    status,
  };
};

export { useLoginWithPersistence };
