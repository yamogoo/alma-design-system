import {
  onMounted,
  ref,
  computed,
  watch,
  type Ref,
  type MaybeRefOrGetter,
  toValue,
  onUnmounted,
} from "vue";

import { Constants } from "@/constants";

import type { Theme, SystemTheme, LocalStorageKey } from "@/typings";

import { useTypedLocalStorage } from "@/composables/local/storage/useTypedLocalStorage";

export interface UseThemeOptions {
  prefix?: string;
  selector?: string;
  key?: LocalStorageKey;
  systemKey?: LocalStorageKey;
}

export const useTheme = (
  init: MaybeRefOrGetter<Theme>,
  opts?: UseThemeOptions
) => {
  const { selector, prefix, key, systemKey } = {
    prefix: "t-",
    selector: "body",
    key: "THEME",
    systemKey: "IS_SYSTEM_THEME_ENABLED",
    ...opts,
  } as Required<UseThemeOptions>;

  const localTheme = useTypedLocalStorage(key, toValue(init));
  const localSystemTheme: Ref<SystemTheme> = ref(localTheme.value);
  const isSystemThemeEnabled = useTypedLocalStorage(
    systemKey,
    Constants.APP_IS_SYSTEM_THEME_ENABLE
  );

  const theme = computed({
    set(value: Theme) {
      localTheme.value = value;
      return value;
    },
    get() {
      return isSystemThemeEnabled.value
        ? localSystemTheme.value
        : localTheme.value;
    },
  });

  const setTheme = (_theme: Theme): void => {
    theme.value = _theme;
  };

  const toggleTheme = (): void => {
    return theme.value === "light" ? setTheme("dark") : setTheme("light");
  };

  const setIsSystemThemeEnabled = (isEnabled: boolean) =>
    (isSystemThemeEnabled.value = isEnabled);

  const setInitSystemTheme = (): void => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setSystemTheme(isDark);
  };

  const setSystemTheme = (isDark: boolean): void => {
    localSystemTheme.value = isDark ? "dark" : "light";
  };

  let mediaQuery: MediaQueryList;
  let mediaHandler: ((e: MediaQueryListEvent) => void) | null = null;

  const onUpdateSystemTheme = (): void => {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaHandler = ({ matches: isDark }) => setSystemTheme(isDark);
    mediaQuery.addEventListener("change", mediaHandler);
  };

  onUnmounted(() => {
    if (mediaQuery && mediaHandler) {
      mediaQuery.removeEventListener("change", mediaHandler);
    }
  });

  onMounted(() => {
    setInitSystemTheme();
    if (isSystemThemeEnabled.value) {
      setSystemTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    onUpdateSystemTheme();
  });

  watch(
    theme,
    (newTheme, prevTheme) => {
      const htmlEl = document.querySelector(selector);

      if (htmlEl && !(prevTheme === newTheme)) {
        htmlEl.classList.remove(`${prefix}${prevTheme}`);
        htmlEl.classList.add(`${prefix}${newTheme}`);
      }
    },
    { immediate: true }
  );

  return {
    theme,
    setTheme,
    toggleTheme,
    localTheme,
    localSystemTheme,
    isSystemThemeEnabled,
    setIsSystemThemeEnabled,
  };
};
