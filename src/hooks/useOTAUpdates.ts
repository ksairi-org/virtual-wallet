import * as Updates from "expo-updates";
import { useCallback } from "react";

export const useOTAUpdates = () => {
  const checkAndApply = useCallback(async (): Promise<void> => {
    if (__DEV__) return;

    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  }, []);

  return { checkAndApply };
};
