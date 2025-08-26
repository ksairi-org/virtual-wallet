import { defineConfig } from "orval";

const infiniteQueryOperationNames: string[] = []; // input function names that need to support infinite querying

const operationOverrides = infiniteQueryOperationNames.reduce(
  (a, b) => ({
    ...a,
    [b]: {
      query: {
        useQuery: true,
        useInfinite: true,
        useInfiniteQueryParam: "nextCursor",
      },
    },
  }),
  {},
);

if (typeof process.env.EXPO_PUBLIC_SUPABASE_OPENAPI_SPEC_URL !== "string") {
  throw new Error(
    "EXPO_PUBLIC_SUPABASE_OPENAPI_SPEC_URL is not defined in the process",
  );
}
export default defineConfig({
  "react-sdk": {
    input: "./supabase-spec.json",
    hooks: {
      afterAllFilesWrite: [
        `node ${__dirname}/adjust-responses.js`,
        `node ${__dirname}/adjust-errors.js`,
      ],
    },
    output: {
      target: "./schema.ts",
      client: "react-query",
      override: {
        mutator: {
          path: "./custom-axios.ts",
          name: "customAxios",
        },
        operations: operationOverrides,
      },
    },
  },
});
