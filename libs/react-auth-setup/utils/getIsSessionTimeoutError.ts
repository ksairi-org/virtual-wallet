import { ErrorCodes } from './constants';
import { getCodeFromError } from './getCodeFromError';

/**
 *
 * @param error error thrown into axios response interceptor
 * @returns boolean
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIsSessionTimeoutError = (error: any) =>
  getCodeFromError(error) === ErrorCodes.TokenExpiredError;

export { getIsSessionTimeoutError };
