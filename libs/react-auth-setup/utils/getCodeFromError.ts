/**
 *
 * @param error error thrown into axios response interceptor
 * @returns string | undefined
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCodeFromError = (error: any) => error?.response?.data?.error?.code;

export { getCodeFromError };
