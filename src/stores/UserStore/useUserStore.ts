import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createZustandMmkvStorage } from "../utils";

const STORAGE_NAME = "user-storage";

type UserStoreState = {
  hasSeenWelcomeScreen: boolean;
  firstName: string;
  lastName: string;
  email: string;
};

type UserStoreFunctions = {
  setKeyValue: <
    Key extends keyof Pick<
      UserStoreState,
      "hasSeenWelcomeScreen" | "firstName" | "lastName" | "email"
    >,
  >(
    key: Key,
    value: UserStoreState[Key],
  ) => void;
};

type GlobalStore = UserStoreState & UserStoreFunctions;

const INITIAL_STATE: UserStoreState = {
  hasSeenWelcomeScreen: false,
  firstName: "",
  lastName: "",
  email: "",
};

const useUserStore = create<GlobalStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setKeyValue: (key, value) => set((state) => ({ ...state, [key]: value })),
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() =>
        createZustandMmkvStorage({ id: STORAGE_NAME }),
      ),
    },
  ),
);

export { useUserStore };
