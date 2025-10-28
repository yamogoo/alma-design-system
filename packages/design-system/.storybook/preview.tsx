import { setup, type Preview } from "@storybook/vue3-vite";
import { type App } from "vue";
import { createPinia } from "pinia";

import { initialize, mswLoader } from "msw-storybook-addon";
import { useAppLayout } from "@/composables/global/useAppLayout";

import "./storybook.theme.scss";

import "@/app.runtime.scss";

import "@/assets/scss/app.global.styles.scss";
import "@/assets/fonts/_fonts.scss";

import motion from "@/tokens/src/motion/theme.json";

initialize({ onUnhandledRequest: "bypass" });
export const decorators = [mswLoader];

const pinia = createPinia();

setup((app: App) => {
  app.use(pinia);
});

let timerId: ReturnType<typeof setTimeout> | null = null;

const withTheme = (Story: any, context: any) => {
  const theme = context.globals.theme || "light";

  const selector = "body";
  const el = document.querySelector(selector);

  if (el) {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }

    // pre-compile:
    el.classList.remove("t-light", "t-dark");
    el.classList.add(`t-${theme}`);

    // runtime:
    el.setAttribute(`data-theme-switching`, "");
    el.setAttribute("data-theme", `${theme}`);

    const safetyDelay = 175;
    const delay = motion.duration.$value + safetyDelay;

    timerId = setTimeout(() => {
      el.removeAttribute(`data-theme-switching`);
      timerId = null;
    }, delay);
  }

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
    actions: { argTypesRegex: "^on[A-Z].*" },
  },
  loaders: [mswLoader],
  decorators: [
    withTheme,
    () => ({
      setup() {
        useAppLayout(".sb-show-main");

        return {};
      },
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
