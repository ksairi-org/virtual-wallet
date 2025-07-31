import type { AuthTokens } from '@utility-nyc/react-query-sdk';

type AuthFunctions = {
  setTokens: (tokens: AuthTokens) => void;
  handleLogout: () => void;
};

type AuthState = AuthFunctions & AuthTokens;

export type { AuthState };
