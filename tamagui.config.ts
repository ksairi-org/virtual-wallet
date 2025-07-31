// This Tamagui config sets up typings for this Nx React Native Expo application
// The main tamagui config is in the `src/themes` to avoid circular imports

import tamaguiConfig from "@default-tamagui-config";

type TamaguiConfig = typeof tamaguiConfig;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends TamaguiConfig {}
}

export default tamaguiConfig;
