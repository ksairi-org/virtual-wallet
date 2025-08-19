import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createZustandMmkvStorage } from "../utils";

const STORAGE_NAME = "user-storage";

type UserStoreState = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  hasSeenWelcomeScreen: boolean;
};

type UserStoreFunctions = {
  setKeyValue: <
    Key extends keyof Pick<
      UserStoreState,
      | "hasSeenWelcomeScreen"
      | "firstName"
      | "middleName"
      | "lastName"
      | "email"
      | "id"
    >,
  >(
    key: Key,
    value: UserStoreState[Key],
  ) => void;
};

type GlobalStore = UserStoreState & UserStoreFunctions;

const INITIAL_STATE: UserStoreState = {
  id: "",
  hasSeenWelcomeScreen: false,
  firstName: "",
  middleName: "",
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
