//import type { Profile } from "@utility-nyc/react-query-sdk";

import { useCallback } from "react";

//import { useSignUp } from "@utility-nyc/react-query-sdk";
import { useAuthStore } from "@react-auth-storage";

//type UseSignUpReturn = ReturnType<typeof useSignUp>;
type MutationParams = Parameters<UseSignUpReturn["mutateAsync"]>[0]["data"];

type ExtraSignUpData = Omit<MutationParams, "credential" | "confirmCredential">;

type SignUpData = {
  identifier: string;
  password: string;
  identifierType: "email" | "username";
  //profile: Profile;
} & ExtraSignUpData;

const REGEX_LOWER_CASE_UP2_NUMBERS = /^[a-z]*(?:\d[a-z]*){0,2}$/;
const REGEX_VALID_EMAIL = /\S+@\S+\.\S+/;
const MAX_USERNAME_LENGTH = 10;

/**
 * Username validations should apply:
 *  - lowercase
 *  - can include up to 2 numbers.
 *  - max length 10
 * @param username string
 * @returns boolean whether username is valid
 */
const isValidUsername = (username: string) => {
  const isLowerCaseAndHasUpToTwoNumbers =
    REGEX_LOWER_CASE_UP2_NUMBERS.test(username);

  const isLengthValid = username.length <= MAX_USERNAME_LENGTH;

  return isLowerCaseAndHasUpToTwoNumbers && isLengthValid;
};

/**
 * Check if email is valid
 * @param email string
 * @returns boolean whether email is valid
 */
const isValidEmail = (email: string) => REGEX_VALID_EMAIL.test(email);

/**
 * @returns function to be used to sign up
 */
const useSignUpWithPersistence = () => {
  const { mutateAsync, ...mutationMetadata } = {}; //useSignUp();
  const setTokens = useAuthStore((state) => state.setTokens);

  const handleSignUp = useCallback(
    async ({
      identifierType,
      identifier,
      password,
      profile,
      ...rest
    }: SignUpData) => {
      if (identifierType === "username" && !isValidUsername(identifier)) {
        throw new Error(
          "Username should be lowercase, can include up to 2 numbers, max length 10",
        );
      }

      if (identifierType === "email" && !isValidEmail(identifier)) {
        throw new Error("Email is invalid");
      }

      const { data } = await mutateAsync({
        data: {
          identifier,
          profile,
          credential: password,
          confirmCredential: password,
          ...rest,
        },
      });

      setTokens(data.tokens);

      return data;
    },
    [mutateAsync, setTokens],
  );

  return { handleSignUp, ...mutationMetadata };
};

export type { ExtraSignUpData, SignUpData };
export { useSignUpWithPersistence };
