import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tseslint from "typescript-eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.storybook/**",
      "**/coverage/**",
      "**/*.temp",
      "**/*.__draft",
    ],
  },
  {
    files: ["**/*.vue"],
    plugins: { vue },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
        projectService: true,
      },
    },
    rules: {},
  },

  /* * * @alma/design-system * * */

  {
    files: [
      "packages/design-system/**/vite.config.{js,ts,mjs,cjs}",
      "packages/design-system/**/eslint.config.{js,ts,mjs,cjs}",
      "packages/design-system/**/.storybook/**/*.{js,ts,mjs,cjs}",
      "packages/design-system/**/scripts/**/*.{js,ts,mjs,cjs}",
    ],
    languageOptions: {
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
  },
  {
    files: ["packages/design-system/**/*.{ts,tsx,vue}"],
    ignores: ["packages/design-system/dist/**"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: path.resolve(__dirname, "packages/design-system"),
        project: ["./tsconfig.eslint.json"],
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],

      "vue/multi-word-component-names": "off",
      "vue/require-default-prop": "off",
      "vue/html-self-closing": "off",
      "vue/max-attributes-per-line": "off",
      "no-undef": "off",
    },
  },

  /* * * apps/sparkpad/client * * */

  {
    files: [
      "apps/sparkpad/client/**/vite.config.{js,ts,mjs,cjs}",
      "apps/sparkpad/client/**/eslint.config.{js,ts,mjs,cjs}",
      "apps/sparkpad/client/**/.storybook/**/*.{js,ts,mjs,cjs}",
      "apps/sparkpad/client/**/scripts/**/*.{js,ts,mjs,cjs}",
    ],
    languageOptions: {
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
  },
  {
    files: ["apps/sparkpad/client/**/*.{ts,tsx,vue}"],
    ignores: ["apps/sparkpad/client/dist/**"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: path.resolve(__dirname, "apps/sparkpad/client"),
        project: ["./tsconfig.eslint.json"],
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],

      "vue/multi-word-component-names": "off",
      "vue/require-default-prop": "off",
      "vue/html-self-closing": "off",
      "vue/max-attributes-per-line": "off",
      "no-undef": "off",
    },
  }
);
