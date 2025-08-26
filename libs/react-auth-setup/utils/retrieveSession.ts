const NEXT_API_AUTH_SESSION_URL = '/api/auth/session';

type RetrieveSession = {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
};

/**
 * Retrieve the session from the NextJS app server.
 * @returns The session tokens.
 */
const retrieveSession = async (): Promise<RetrieveSession> => {
  const res = await fetch(NEXT_API_AUTH_SESSION_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { tokens } = await res.json();

  return tokens;
};

export { retrieveSession };
