/**
 *
 * @param object unknown object
 * @returns boolean
 */

import { AuthTokens } from "@react-auth-storage/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIsObjectAuthTokens = (object?: any): object is AuthTokens =>
  !!object?.accessToken;

export { getIsObjectAuthTokens };
