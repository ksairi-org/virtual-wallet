import {
  AuthTokenResponse,
  SignInWithIdTokenCredentials,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";

import { useCallback, useState } from "react";

import { useAuthStore } from "@react-auth-storage";
import { useUserStore } from "@stores";
import { supabase } from "@backend";

type Status = "idle" | "loading" | "error" | "success";

/**
 * @returns functions to be used to login either with username or email or social networks.
 */
const useLoginWithPersistence = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const setKeyValue = useUserStore((state) => state.setKeyValue);
  const [status, setStatus] = useState<Status>("idle");

  const setLoggedUserData = useCallback(
    ({ data }: AuthTokenResponse) => {
      setTokens({
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      });
      setKeyValue("id", data.user.id);
      setKeyValue("email", data.user.email);
    },
    [setKeyValue, setTokens],
  );

  const handleLogInSocialNetwork = useCallback(
    async (credentials: SignInWithIdTokenCredentials) => {
      try {
        setStatus("loading");
        const response = await supabase.auth.signInWithIdToken(credentials);
        setLoggedUserData(response);
        setStatus("success");
        if (response.error) {
          throw response.error;
        }
        return response.data.user;
      } catch (error) {
        console.error("Login failed with social", error);
        setStatus("error");
        throw new Error(error);
      }
    },
    [setLoggedUserData],
  );

  const handleLogInWithEmail = useCallback(
    async (credentials: SignInWithPasswordCredentials) => {
      try {
        setStatus("loading");
        const response = await supabase.auth.signInWithPassword(credentials);
        setLoggedUserData(response);
        setStatus("success");
        return response.data.user;
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
