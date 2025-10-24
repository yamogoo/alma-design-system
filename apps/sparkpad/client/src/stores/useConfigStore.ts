import { ref, computed, type ComputedRef } from "vue";
import { defineStore } from "pinia";

import { useTheme, type Themes, THEMES } from "@alma/design-system";

import { Constants } from "@/constants";

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
  } = useTheme(Constants.APP_DEFAULT_THEME, {
    selector: "html",
    prefix: "theme-",
    key: "THEME",
    systemKey: "IS_SYSTEM_THEME_ENABLED",
  });

  const isLightTheme = computed(() => {
    return currentTheme.value === "light";
  });

  const getSid: ComputedRef<number> = computed(() => {
    return (THEMES as Themes).findIndex(
      (theme) => theme === currentTheme.value
    );
  });

  /* * * Common * * */

  const currentPackageVersion = ref("");
  const setCurrentPackageVersion = (version: string) =>
    (currentPackageVersion.value = version);

  const reset = (): void => {
    setTheme(Constants.APP_DEFAULT_THEME);
    setIsSystemThemeEnabled(false);
    setCurrentPackageVersion("");
  };

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

    reset,
  };
});
