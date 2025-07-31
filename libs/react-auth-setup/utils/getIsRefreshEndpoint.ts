const REFRESH_URL = 'auth/refresh';

/**
 *
 * @param url string | undefine
 * @returns boolean
 */
const getIsRefreshEndpoint = (url?: string) => url?.includes(REFRESH_URL);

export { getIsRefreshEndpoint };
