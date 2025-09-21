import { defineStore } from "pinia";

import { useTypedLocalStorage } from "@/composables/local";

const DEFAULT_IS_NAVIGATOR_SHOWN =
  Boolean(import.meta.env.VITE_DEFAULT_IS_NAVIGATOR_SHOWN) ?? true;
export const DEFAULT_NAVIGATOR_WIDTH =
    +import.meta.env.VITE_DEFAULT_NAVIGATOR_WIDTH || 320,
  DEFAULT_NAVIGATOR_MIN_WIDTH =
    +import.meta.env.VITE_DEFAULT_NAVIGATOR_MIN_WIDTH || 240,
  DEFAULT_NAVIGATOR_MAX_WIDTH =
    +import.meta.env.VITE_DEFAULT_NAVIGATOR_MAX_WIDTH || 480;

export const useEditorLayout = defineStore("editor-layout-store", () => {
  const isNavigatorShown = useTypedLocalStorage(
    "IS_NAVIGATOR_SHOWN",
    DEFAULT_IS_NAVIGATOR_SHOWN
  );

  const setIsNavigatorShown = (value: boolean) =>
    (isNavigatorShown.value = value);

  const navigatorWidth = useTypedLocalStorage(
    "NAVIGATOR_WIDTH",
    DEFAULT_NAVIGATOR_WIDTH
  );

  const setNavigatorWidth = (value: number) => (navigatorWidth.value = value);

  const reset = (): void => {
    isNavigatorShown.value = DEFAULT_IS_NAVIGATOR_SHOWN;
  };

  return {
    isNavigatorShown,
    setIsNavigatorShown,
    navigatorWidth,
    setNavigatorWidth,
    reset,
  };
});
