const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = defineConfig([
  {
    ignores: [
      "dist/*",
      ".expo",
      "node_modules",
      "libs/react-query-sdk/schema.ts",
      "supabase/functions/**",
    ],
  },
  expoConfig,
  {
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
]);
