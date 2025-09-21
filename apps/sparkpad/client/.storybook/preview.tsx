import { setup, type Preview } from "@storybook/vue3";
import { type App } from "vue";
import { createPinia } from "pinia";

import "./storybook.theme.scss";

import "@/assets/scss/app.global.styles.scss";
import "@/assets/fonts/_fonts.scss";

const pinia = createPinia();

setup((app: App) => {
  app.use(pinia);
});

const withTheme = (Story: any, context: any) => {
  const theme = context.globals.theme || "light";

  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(`theme-${theme}`);

  return Story();
};

const preview: Preview = {
  parameters: {
    a11y: {
      /*
       * Axe's context parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#context-parameter
       * to learn more. Typically, this is the CSS selector for the part of the DOM you want to analyze.
       */
      context: "body",
      /*
       * Axe's configuration
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
       * to learn more about the available properties.
       */
      config: {},
      /*
       * Axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {},
    },
  },
  decorators: [
    withTheme,
    () => ({
      template: '<div class="storybook-main-container"><story/></div>',
    }),
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme switcher",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: ["light", "dark"],
      },
    },
  },
};

export default preview;
