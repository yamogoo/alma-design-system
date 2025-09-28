import { createApp, type Component } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import { router } from "./router";

import { initErrorLogger, logError } from "@/utils";

import "@alma/design-system/style.css";
import "@alma/design-system/global.styles.scss";

const app = createApp(App as Component);

app.config.errorHandler = (err, _instance, info) => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  logError(err, { tags: { vueInfo: info } });
};

app.use(router);
app.use(createPinia());

initErrorLogger();
app.mount("#app");
