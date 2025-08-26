import { ErrorCodes } from './constants';
import { getCodeFromError } from './getCodeFromError';

/**
 *
 * @param error error thrown into axios response interceptor
 * @returns boolean
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIsUnsuccessfulLoginError = (error: any) =>
  getCodeFromError(error) === ErrorCodes.AuthLoginError;

export { getIsUnsuccessfulLoginError };
