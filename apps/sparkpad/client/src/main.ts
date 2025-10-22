import { createApp, type Component } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import { router } from "./router";

import "@alma/design-system/style.css";
import "@alma/design-system/styles.runtime.css";
import "@alma/design-system/global.styles.scss";

// import { createI18n } from "vue-i18n";

// const i18n = createI18n({});

const app = createApp(App as Component);

app.use(router);
app.use(createPinia());
// app.use(i18n);
app.mount("#app");
