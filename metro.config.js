const { getDefaultConfig } = require("expo/metro-config");
const { withSentryConfig } = require("@sentry/react-native/metro");
const { mergeConfig } = require("metro-config");
const exclusionList = require("metro-config/private/defaults/exclusionList");

const defaultConfig = getDefaultConfig(__dirname);

const { assetExts, sourceExts } = defaultConfig.resolver;

/** @type {import('expo/metro-config').MetroConfig} */
const customConfig = {
  transformer: {
    babelTransformerPath: require.resolve(
      "@expo/metro-config/babel-transformer",
    ),
  },
  resolver: {
    assetExts: [...assetExts.filter((ext) => ext !== "svg"), "riv"],
    sourceExts: [...sourceExts, "svg"],
    blockList: exclusionList([/^(?!.*node_modules).*\/dist\/.*/]),
    unstable_enablePackageExports: true,
    resolverMainFields: ["sbmodern", "react-native", "browser", "main"],
  },
};

module.exports = withSentryConfig(mergeConfig(defaultConfig, customConfig));
