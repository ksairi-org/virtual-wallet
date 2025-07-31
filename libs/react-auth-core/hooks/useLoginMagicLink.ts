import { useCallback } from "react";

//import { useMagicLinkLogin } from '@utility-nyc/react-query-sdk';

//type UseLoginReturn = ReturnType<typeof useMagicLinkLogin>;
type MutationParams = Parameters<UseLoginReturn["mutateAsync"]>[0]["data"];

type ExtraLoginData = Omit<MutationParams, "credential">;

type LoginData = {
  identifier: string;
} & ExtraLoginData;

/**
 * @returns function to be used to login sending an email with magic link
 */
const useLoginMagicLink = () => {
  //const { mutateAsync, ...mutationMetadata } = useMagicLinkLogin();

  const handleLogIn = useCallback(
    async ({ identifier }: LoginData) => {
      // const { data } = await mutateAsync({
      //   data: {
      //     identifier,
      //   },
      //});
      //      return data;
    },
    [
      /*mutateAsync*/
    ],
  );

  return { handleLogIn /*...mutationMetadata*/ };
};

export { useLoginMagicLink };
