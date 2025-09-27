import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

// import storybook from "eslint-plugin-storybook";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.output/**",
      "**/.vscode/**",
      "**/coverage/**",
      "tokens/build/**",
      "**/*.d.ts",
      "**/*.__draft*",
      "**/*.temp",
      "**/tests-report/*",
      "**/error-logger/**",
    ],
  },

  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,

  // Vue SFC
  ...vue.configs["flat/recommended"],

  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
      "no-async-promise-executor": "off",
      "vue/multi-word-component-names": "off",
      "vue/require-default-prop": "off",
      "vue/html-self-closing": "off",
      "vue/max-attributes-per-line": "off",
    },
  },

  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
  },

  {
    files: [
      "**/vite.config.{js,ts,mjs,cjs}",
      "**/eslint.config.{js,ts,mjs,cjs}",
      "**/.storybook/**/*.{js,ts,mjs,cjs}",
      "**/scripts/**/*.{js,ts,mjs,cjs}",
    ],
    languageOptions: { globals: globals.node, sourceType: "module" },
  },
];
