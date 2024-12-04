// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import neverthrowPlugin from "@okee-tech/eslint-plugin-neverthrow";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";

export default withNuxt([
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  // @ts-expect-error `neverthrowPlugin` has TSESLint Config instead of ESLint Config
  {
    ...neverthrowPlugin.configs.recommended,
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: "module",
        ecmaVersion: "latest",
        project: ["./tsconfig.json"],
      },
    },
  },
]);
