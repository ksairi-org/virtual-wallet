type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
};

type AuthFunctions = {
  setTokens: (tokens: AuthTokens) => void;
  handleLogout: () => void;
};

type AuthState = AuthFunctions & AuthTokens;

export type { AuthState, AuthTokens };
