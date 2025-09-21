import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import { router } from "./router";

import { initErrorLogger, logError } from "@@/utils";

import "@/assets/scss/app.fonts.scss";

import "@/assets/scss/app.global.styles.scss";
import "@/assets/scss/app.fonts.scss";

const app = createApp(App);

app.config.errorHandler = (err, _instance, info) => {
  logError(err, { tags: { vueInfo: info } });
};

app.use(router);
app.use(createPinia());

initErrorLogger();
app.mount("#app");
