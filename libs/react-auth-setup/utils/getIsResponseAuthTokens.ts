//import type { AuthTokens } from '@utility-nyc/react-query-sdk';

/**
 *
 * @param object unknown object
 * @returns boolean
 */
const getIsObjectAuthTokens = (object?: any): object is AuthTokens =>
  !!object?.accessToken;

export { getIsObjectAuthTokens };
