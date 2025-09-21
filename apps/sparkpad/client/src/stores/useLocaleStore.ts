import { computed } from "vue";
import { defineStore } from "pinia";

import locales from "@@/locales";
import { useTypedLocalStorage } from "@/composables/local";

import type { Locale, LocaleSchema } from "@@/typings";

const DEFAULT_LOCALE = import.meta.env.VITE_APP_DEFAULT_LOCALE as Locale;

export type LocaleVersion = keyof typeof locales.app.en.common.version;

export const useLocaleStore = defineStore("locale-store", () => {
  const availableLocales = Object.keys(locales.app) as Locale[];

  const currentLocale = useTypedLocalStorage<Locale>(
    "LOCALE",
    availableLocales.includes(DEFAULT_LOCALE)
      ? DEFAULT_LOCALE
      : availableLocales[0]
  );

  const setLocale = (locale: Locale) => {
    if (availableLocales.includes(locale)) {
      currentLocale.value = locale;
    } else {
      console.warn(`[locale-store] Unknown locale: ${locale}`);
    }
  };

  const $t = computed<LocaleSchema>(() => {
    return locales.app[currentLocale.value];
  });

  return {
    currentLocale,
    setLocale,
    $t,
  };
});
