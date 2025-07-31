import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createZustandMmkvStorage } from './utils';

const STORAGE_NAME = 'global-storage';

type GlobalStoreState = {
  hasSeenWelcomeScreen: boolean;
  selectedLocale?: string;
};

type GlobalStoreFunctions = {
  setKeyValue: <
    Key extends keyof Pick<
      GlobalStoreState,
      'hasSeenWelcomeScreen' | 'selectedLocale'
    >,
  >(
    key: Key,
    value: GlobalStoreState[Key],
  ) => void;
};

type GlobalStore = GlobalStoreState & GlobalStoreFunctions;

const INITIAL_TOKENS_STATE: GlobalStoreState = {
  hasSeenWelcomeScreen: false,
};

const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      ...INITIAL_TOKENS_STATE,
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

export { useGlobalStore };
