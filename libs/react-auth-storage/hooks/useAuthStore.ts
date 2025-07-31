import type { AuthState } from "./types";
//import type { AuthTokens } from '@utility-nyc/react-query-sdk';

import { createJSONStorage, persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { createZustandMmkvStorage } from "../utils/createZustandMmkvStorage";
// @ts-ignore
const IS_WEB = typeof sessionStorage !== "undefined";

const SESSION_STORAGE_NAME = "auth-storage";

const INITIAL_TOKENS_STATE: Pick<
  AuthState,
  "accessToken" | "refreshToken" | "idToken"
> = {
  accessToken: "",
  refreshToken: "",
  idToken: "",
};

const useAuthStore = createWithEqualityFn<AuthState>()(
  persist(
    (set, get) => ({
      ...INITIAL_TOKENS_STATE,
      setTokens: (tokens: AuthTokens) => set({ ...tokens }),
      handleLogout: () => {
        const state = get();

        const keys = Object.keys(state) as (keyof AuthState)[];

        const wipedState = keys.reduce((acc, nextKey) => {
          // We want to wipe all tokens
          if (typeof state[nextKey] === "string") {
            // @ts-ignore
            acc[nextKey] = "";
          }

          return acc;
        }, {} as Partial<AuthState>);

        set(wipedState);
      },
    }),
    {
      name: SESSION_STORAGE_NAME,
      storage: createJSONStorage(() => {
        if (IS_WEB) {
          // @ts-ignore
          return sessionStorage;
        }

        return createZustandMmkvStorage({ id: SESSION_STORAGE_NAME });
      }),
    },
  ),
  shallow,
);

export { useAuthStore };
