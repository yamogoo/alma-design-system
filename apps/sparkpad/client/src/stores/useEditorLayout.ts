import { defineStore } from "pinia";

import { Constants } from "../constants";

import { useTypedLocalStorage } from "@/composables/local";

export const useEditorLayout = defineStore("editor-layout-store", () => {
  const isNavigatorShown = useTypedLocalStorage(
    "IS_NAVIGATOR_SHOWN",
    Constants.DEFAULT_IS_NAVIGATOR_SHOWN
  );

  const setIsNavigatorShown = (value: boolean) =>
    (isNavigatorShown.value = value);

  const navigatorWidth = useTypedLocalStorage(
    "NAVIGATOR_WIDTH",
    Constants.DEFAULT_NAVIGATOR_WIDTH
  );

  const setNavigatorWidth = (value: number) => (navigatorWidth.value = value);

  const reset = (): void => {
    isNavigatorShown.value = Constants.DEFAULT_IS_NAVIGATOR_SHOWN;
  };

  return {
    isNavigatorShown,
    setIsNavigatorShown,
    navigatorWidth,
    setNavigatorWidth,
    reset,
  };
});
