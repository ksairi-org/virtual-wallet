import { registerRootComponent } from "expo";

import { SentryApp as App } from "./src/app/SentryApp";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
