import type { StorybookConfig } from "@storybook/vue3";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "msw-storybook-addon",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  staticDirs: ["../public"],
};
export default config;
