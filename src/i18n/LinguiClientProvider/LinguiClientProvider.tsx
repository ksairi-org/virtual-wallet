import type { I18nProviderProps } from "@lingui/react";

import { useEffect } from "react";

import { Platform, Settings } from "react-native";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";

import { setI18nLocale } from "../utils";
import { getLocales } from "expo-localization";

type LinguiClientProviderProps = {
  children: I18nProviderProps["children"];
};

const LinguiClientProvider = ({ children }: LinguiClientProviderProps) => {
  useEffect(() => {
    const newLocale = getLocales()[0].languageCode;
    if (Platform.OS === "ios") {
      Settings.set({ AppleLanguage: newLocale });
    }
    setI18nLocale(newLocale);
  }, []);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};

export { LinguiClientProvider };
