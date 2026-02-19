const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

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
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
]);
