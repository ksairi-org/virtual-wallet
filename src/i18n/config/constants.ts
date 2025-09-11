import { Locale } from "expo-localization";

const locales = {
  es: "Español",
  en: "English",
};

const defaultFallbackLocale: Locale["languageTag"] = "es";

export { locales, defaultFallbackLocale };
