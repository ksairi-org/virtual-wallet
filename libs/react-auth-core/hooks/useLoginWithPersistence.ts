import { firebase, FirebaseAuthTypes } from "@react-native-firebase/auth";

import { useCallback, useState } from "react";

import { useAuthStore } from "@react-auth-storage";

type LoginData = {
  email: string;
  password: string;
};

/**
 * @returns functions to be used to login either with username or email or social networks.
 */
const useLoginWithPersistence = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
        const userCredential = await firebase
          .auth()
          .signInWithCredential(credential);

        saveCredentials(userCredential);
      } catch (error) {
        console.error("Login failed with social:", error);
        throw new Error("Login failed");
      } finally {
        setLoading(false);
      }
    },
    [saveCredentials],
  );

  const handleLogInWithEmail = useCallback(
    async ({ email, password }: LoginData) => {
      try {
        setLoading(true);
        const userCredential = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);

        saveCredentials(userCredential);
      } catch (error) {
        console.error("Login failed with email:", error);
        throw new Error("Login failed");
      } finally {
        setLoading(false);
      }
    },
    [saveCredentials],
  );

  return {
    handleLogInWithEmail,
    handleLogInSocialNetwork,
    loading,
  };
};

export { useLoginWithPersistence };
