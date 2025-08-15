import { useCallback, useState } from "react";
import { getApp } from "@react-native-firebase/app";
import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";
import { useAuthStore } from "@react-auth-storage";
import { useUserStore } from "@stores";

type SignUpData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

type User = Pick<FirebaseAuthTypes.User, "email" | "uid"> &
  Pick<SignUpData, "firstName" | "lastName">;

type Status = "idle" | "loading" | "error" | "success";

const auth = getAuth(getApp());

const isDuplicateError = (message: string) =>
  message.includes("The email address is already in use by another account");

/**
 * @returns function to be used to sign up
 */
const useSignUpWithPersistence = () => {
  const [status, setStatus] = useState<Status>("idle");
  const setTokens = useAuthStore((state) => state.setTokens);
  const setKeyValue = useUserStore((state) => state.setKeyValue);

  const setLoggedUserData = useCallback(
    (user: User) => {
      setKeyValue("id", user.uid);
      setKeyValue("email", user.email);
      setKeyValue("firstName", user.firstName);
      setKeyValue("lastName", user.lastName);
    },
    [setKeyValue],
  );

  const handleSignUp = useCallback(
    async ({ email, password, firstName, lastName }: SignUpData) => {
      try {
        setStatus("loading");
        const { user } = await auth.createUserWithEmailAndPassword(
          email,
          password,
        );
        const newUser = {
          uid: user.uid,
          email: user.email,
          firstName,
          lastName,
        };
        setTokens({ accessToken: await user.getIdToken() });
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
    [setLoggedUserData, setTokens],
  );

  return { handleSignUp, status };
};

export type { SignUpData };
export { useSignUpWithPersistence };
