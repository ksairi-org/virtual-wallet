module.exports = function (api) {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.BABEL_ENV === "production";

  api.cache.using(() => isProduction);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "babel-plugin-inline-import",
        {
          extensions: [".svg"],
        },
      ],
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          logTimings: true,
          config: "./tamagui.config.ts",
          disableExtraction: process.env.NODE_ENV === "development",
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
