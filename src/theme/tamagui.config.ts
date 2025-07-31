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

type TamaguiConfig = typeof tamaguiConfig;

declare module "tamagui" {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends TamaguiConfig {}
}

export default tamaguiConfig;
