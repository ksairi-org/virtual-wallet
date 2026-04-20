/** @type {import('jest-expo').JestExpoConfig} */
module.exports = {
  preset: "jest-expo",
  setupFilesAfterFramework: ["@testing-library/react-native/extend-expect"],
  // jest-expo's default pattern covers core RN and Expo packages.
  // Extend it with project-specific ESM packages that must be transformed.
  transformIgnorePatterns: [
    "node_modules/(?!" +
      [
        "(jest-)?react-native",
        "@react-native(-community)?",
        "expo(nent)?",
        "@expo(nent)?/.*",
        "@expo-google-fonts/.*",
        "react-navigation",
        "@react-navigation/.*",
        "@unimodules/.*",
        "unimodules",
        "sentry-expo",
        "@sentry/.*",
        "native-base",
        "react-native-svg",
        "tamagui",
        "@tamagui/.*",
        "moti",
        "@motify/.*",
        "@gorhom/.*",
        "@shopify/.*",
        "burnt",
        "rive-react-native",
        "@stripe/stripe-react-native",
        "@dev-plugins/.*",
      ].join("|") +
      ")",
  ],
  moduleNameMapper: {
    // Silence static asset imports (SVGs, images) that would fail in Jest
    "\\.svg$": "<rootDir>/src/__mocks__/fileMock.js",
  },
};
