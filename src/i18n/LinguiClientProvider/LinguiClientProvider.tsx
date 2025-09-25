import type { I18nProviderProps } from "@lingui/react";
import { useEffect, useState } from "react";
import { Platform, Settings } from "react-native";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { setI18nLocale } from "../utils";
import { getLocales } from "expo-localization";

type LinguiClientProviderProps = {
  children: I18nProviderProps["children"];
};

const LinguiClientProvider = ({ children }: LinguiClientProviderProps) => {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    const initializeI18n = () => {
      const newLocale = getLocales()[0].languageCode;
      if (Platform.OS === "ios") {
        Settings.set({ AppleLanguages: newLocale });
      }
      setI18nLocale(newLocale);
      setIsI18nReady(true);
    };

    initializeI18n();
  }, []);

  if (!isI18nReady) {
    return null;
  }

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};

export { LinguiClientProvider };
