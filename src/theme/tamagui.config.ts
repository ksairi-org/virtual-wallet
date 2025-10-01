// This is the base Tamagui config for this monorepo
// It is used by the tamagui CLI to generate typings based on this project's configuration

import { typedKeys } from "@typescript-functions";
import { createTamagui, createTokens } from "tamagui";
import { themes } from "./themes";
import { sizesSpaces, radius, fonts } from "./tokens";

const keyOfFirstTheme = typedKeys(themes)[0];
const color = themes[keyOfFirstTheme];

const tamaguiConfig = createTamagui({
  themes,
  tokens: createTokens({
    color,
    size: sizesSpaces,
    space: sizesSpaces,
    zIndex: sizesSpaces,
    radius,
  }),
  fonts,
  settings: {
    allowedStyleValues: "strict",
  },
});

export default tamaguiConfig;
