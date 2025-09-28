import { ref, computed, type ComputedRef } from "vue";
import { defineStore } from "pinia";

import { Composables } from "@alma/design-system";

import { Typings } from "@alma/design-system";

export const themes: Typings.Themes = ["light", "dark"];

const { useTheme } = Composables.Global;

export const DEFAULT_THEME = import.meta.env.VITE_UI_LOCAL_THEME as
  | Typings.Theme
  | undefined;

export const DEFAULT_PROTO_THEME = import.meta.env.VITE_UI_LOCAL_PROTO_THEME as
  | Typings.Theme
  | undefined;

export const useConfigStore = defineStore("config-store", () => {
  const settingsData = computed(() => {
    return {};
  });

  const {
    theme: currentTheme,
    isSystemThemeEnabled,
    setTheme,
    toggleTheme,
    setIsSystemThemeEnabled,
  } = useTheme(DEFAULT_THEME ?? "dark", {
    selector: "html",
    prefix: "theme-",
    key: "THEME",
    systemKey: "IS_SYSTEM_THEME_ENABLED",
  });

  const isLightTheme = computed(() => {
    return currentTheme.value === "light";
  });

  const getSid: ComputedRef<number> = computed(() => {
    return themes.findIndex((theme) => theme === currentTheme.value);
  });

  /* * * Common * * */

  const currentPackageVersion = ref("");
  const setCurrentPackageVersion = (version: string) =>
    (currentPackageVersion.value = version);

  return {
    settingsData,

    currentTheme,
    isLightTheme,
    isSystemThemeEnabled,
    setTheme,
    toggleTheme,
    setIsSystemThemeEnabled,
    getSid,

    currentPackageVersion,
    setCurrentPackageVersion,
  };
});
