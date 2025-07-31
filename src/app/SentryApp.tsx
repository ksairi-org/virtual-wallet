import { setupSentry } from "@sentry";
import * as Sentry from "@sentry/react-native";
import App from "./App";

const shouldEnableSentry = !__DEV__;

setupSentry(shouldEnableSentry);

const SentryApp = Sentry.wrap(App);

export { SentryApp };
