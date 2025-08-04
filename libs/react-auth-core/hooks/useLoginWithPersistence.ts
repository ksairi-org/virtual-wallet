import { firebase, FirebaseAuthTypes } from "@react-native-firebase/auth";

import { useCallback, useState } from "react";

import { useAuthStore } from "@react-auth-storage";

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

  const saveCredentials = useCallback(
    (credentials: FirebaseAuthTypes.UserCredential) => {
      const token = credentials.user.getIdToken();
      setTokens(token);
    },
    [setTokens],
  );

  const handleLogInSocialNetwork = useCallback(
    async (credential: FirebaseAuthTypes.AuthCredential) => {
      try {
        setStatus("loading");
        const userCredential = await firebase
          .auth()
          .signInWithCredential(credential);

        saveCredentials(userCredential);
        setStatus("success");
      } catch (error) {
        setStatus("error");
        console.error("Login failed with social:", error);
      }
    },
    [saveCredentials],
  );

  const handleLogInWithEmail = useCallback(
    async ({ email, password }: LoginData) => {
      try {
        setStatus("loading");
        const userCredential = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);

        saveCredentials(userCredential);
        setStatus("success");
      } catch (error) {
        console.error("Login failed with email:", error);
        setStatus("error");
      }
    },
    [saveCredentials],
  );

  return {
    handleLogInWithEmail,
    handleLogInSocialNetwork,
    status,
  };
};

export { useLoginWithPersistence };
