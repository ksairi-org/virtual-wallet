import type { Messages } from "@lingui/core";

import { i18n } from "@lingui/core";
import type { Locale } from "expo-localization";

import { defaultFallbackLocale, locales } from "./config/constants";
import "./types/metroRequire.d.ts";

function getFileNameWithoutFolderOrExtension(filename: string): string {
  const fileNameWithoutExtension = filename.split(".").slice(0, -1).join(".");
  const lastSlashIndex = fileNameWithoutExtension.lastIndexOf("/");

  if (lastSlashIndex !== -1) {
    return fileNameWithoutExtension.slice(lastSlashIndex + 1);
  }

  return fileNameWithoutExtension;
}

function compactMap<T, U>(
  arr: T[],
  transform: (item: T) => U | null | undefined,
): U[] {
  return arr
    .map(transform) // Step 1: Map and transform, possibly returning null for some inputs
    .filter((item) => item !== null && item !== undefined) as U[]; // Step 2: Filter out null and undefined results
}

type ModuleExports = { messages: Messages };
type Catalogs = { [k: string]: Messages };

const loadCatalogs = (): Catalogs => {
  const req = require.context("./locales/compiled", false, /.*\.ts$/);
  console.log("Loaded", req.keys().length, "catalogs");

  return compactMap(req.keys(), (filename: string) => {
    try {
      const fileExports = req(filename) as ModuleExports;
      const locale = getFileNameWithoutFolderOrExtension(filename);

      return {
        [locale]: fileExports.messages,
      };
    } catch (e) {
      console.log("Couldn't load catalog", filename);

      console.error(e);

      return undefined;
    }
  }).reduce((acc, oneCatalog) => ({ ...acc, ...oneCatalog }), {});
};

const allMessages = loadCatalogs();

const getMessagesForLocale = (locale: Locale["languageTag"]) =>
  allMessages[locale];

/**
 * We do a dynamic import of just the catalog that we need
 * @param locale any locale string
 */
const setI18nLocale = (locale: string) => {
  const validLocale = isI18nLocale(locale) ? locale : defaultFallbackLocale;
  const messages = getMessagesForLocale(validLocale);
  i18n.loadAndActivate({
    locale: validLocale,
    messages,
  });
};

function isI18nLocale(
  value: string | null | undefined,
): value is Locale["languageTag"] {
  return value ? Object.keys(locales).includes(value) : false;
}

export { setI18nLocale };
