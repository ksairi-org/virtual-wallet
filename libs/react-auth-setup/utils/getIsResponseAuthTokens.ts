import type { AuthTokens } from '@utility-nyc/react-query-sdk';

/**
 *
 * @param object unknown object
 * @returns boolean
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIsObjectAuthTokens = (object?: any): object is AuthTokens =>
  !!object?.accessToken;

export { getIsObjectAuthTokens };
