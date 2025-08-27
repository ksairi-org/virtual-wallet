import { useCallback, useState } from "react";
import { useUserStore } from "@stores";
import {
  SignUpWithPasswordCredentials,
  User as SupaBaseUser,
} from "@supabase/supabase-js";
import { supabase } from "@react-auth-client";

type SignUpData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

type User = Pick<SupaBaseUser, "id" | "email"> &
  Pick<SignUpData, "firstName" | "lastName">;

type Status = "idle" | "loading" | "error" | "success";

const isDuplicateError = (message: string) =>
  message.includes("The email address is already in use by another account");

/**
 * @returns function to be used to sign up
 */
const useSignUpWithPersistence = () => {
  const [status, setStatus] = useState<Status>("idle");
  const setKeyValue = useUserStore((state) => state.setKeyValue);

  const setLoggedUserData = useCallback(
    (user: User) => {
      setKeyValue("id", user.id);
      setKeyValue("email", user.email);
      setKeyValue("firstName", user.firstName);
      setKeyValue("lastName", user.lastName);
    },
    [setKeyValue],
  );

  const handleSignUp = useCallback(
    async (data: SignUpWithPasswordCredentials) => {
      try {
        setStatus("loading");
        const {
          data: { user },
          error,
        } = await supabase.auth.signUp(data);
        if (error) {
          throw error;
        }

        const newUser = {
          id: user.id,
          email: user.email,
          firstName: user.user_metadata["firstName"],
          lastName: user.user_metadata["lastName"],
        };
        //TODO: need to confirm email before setting user data, will set smtp server in supabase for this
        setLoggedUserData(newUser);
        setStatus("success");
        return newUser;
      } catch (e) {
        console.error(e);
        setStatus("error");
        throw new Error(
          isDuplicateError(e.message)
            ? "Email already taken. Please use another one"
            : e,
        );
      }
    },
    [setLoggedUserData],
  );

  return { handleSignUp, status };
};

export type { SignUpData };
export { useSignUpWithPersistence };
