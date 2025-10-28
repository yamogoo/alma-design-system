import { mergeConfig } from "vite";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/vue3-vite";

const srcDir = fileURLToPath(new URL("../src", import.meta.url));
const tokensCacheDir = fileURLToPath(
  new URL("../src/tokens/.cache", import.meta.url)
);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "msw-storybook-addon",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  staticDirs: ["../public"],
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      resolve: {
        alias: [
          { find: "@", replacement: srcDir },
          { find: "@/tokens/src", replacement: tokensCacheDir },
        ],
      },
    });
  },
};
export default config;
