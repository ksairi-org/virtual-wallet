import "dotenv/config";
import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * Expo App Config File - Automatically generated - Modify with caution!
 * @param params parameters
 * @param params.config Expo config
 * @returns Expo config mode
 */
// eslint-disable-next-line import/no-default-export
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.p,
  slug: "virtual-wallet",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  icon: "./assets/app-icon.png",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#dce9ed",
  },
  ios: {
    bundleIdentifier: process.env.APP_IDENTIFIER_IOS,
    googleServicesFile: process.env.GOOGLE_SERVICES_INFOPLIST_PATH,
    infoPlist: {
      UIBackgroundModes: ["fetch", "remote-notification"],
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: false,
        NSAllowsLocalNetworking: true,
      },
      ITSAppUsesNonExemptEncryption: false,
      CFBundleURLTypes: [
        {
          CFBundleURLName: "virtual-wallet-deeplink",
          CFBundleURLSchemes: ["virtual-wallet"],
        },
        {
          CFBundleURLSchemes: [],
        },
      ],
    },
    entitlements: {
      "aps-environment": "production",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#000000",
    },
    package: process.env.APP_IDENTIFIER_ANDROID,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON_PATH,
    permissions: ["android.permission.POST_NOTIFICATIONS"],
  },
  plugins: [
    "expo-font",
    "@react-native-firebase/app",
    [
      "expo-notifications",
      {
        icon: "./assets/notifications-icon.png",
        enableBackgroundRemoteNotifications: true,
      },
    ],
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
        android: {
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          extraProguardRules: `
            -keep class com.stripe.android.** { *; }
            -keep class com.stripe.android.pushProvisioning.** { *; }
            -keep class com.reactnativestripesdk.** { *; }
            -dontwarn com.stripe.android.**
            -dontwarn com.reactnativestripesdk.**

            # Keep React Native classes
            -keep class com.facebook.react.** { *; }
            -keep class com.th3rdwave.safeareacontext.** { *; }

            # Keep annotation attributes
            -keepattributes *Annotation*
            -keepclassmembers class * {
              @com.facebook.react.uimanager.annotations.ReactProp <methods>;
            }
            -keepclassmembers class * {
              @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
            }
          `,
        },
      },
    ],
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        note: "Use SENTRY_AUTH_TOKEN env to authenticate with Sentry.",
        project: process.env.SENTRY_PROJECT,
        organization: process.env.SENTRY_ORG,
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "8a1c04aa-f006-452b-9bc6-8236ca8c2501",
    },
  },
  owner: "ksairi-org",
});
