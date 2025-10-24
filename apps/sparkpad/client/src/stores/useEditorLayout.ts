import { defineStore } from "pinia";

import { Constants } from "@/constants";

import { Composables } from "@alma/design-system";

const { useTypedLocalStorage } = Composables.Local;

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
    setIsNavigatorShown(Constants.DEFAULT_IS_NAVIGATOR_SHOWN);
    setNavigatorWidth(Constants.DEFAULT_NAVIGATOR_WIDTH);
  };

  return {
    isNavigatorShown,
    setIsNavigatorShown,
    navigatorWidth,
    setNavigatorWidth,
    reset,
  };
});
