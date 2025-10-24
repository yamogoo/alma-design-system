import { defineStore } from "pinia";

import { Constants } from "@/constants";

import { Composables } from "@alma/design-system";

const { useTypedLocalStorage } = Composables.Local;

export const useEditorSettings = defineStore("editor-settings-store", () => {
  const fontSize = useTypedLocalStorage(
    "EDITOR_FONT_SIZE",
    Constants.EDITOR_DEFAULT_FONT_SIZE
  );
  const setFontSize = (size: number): number => (fontSize.value = size);

  const tabIdentSize = useTypedLocalStorage(
    "EDITOR_TAB_IDENT_SIZE",
    Constants.EDITOR_DEFAULT_TAB_IDENT_SIZE
  );
  const setTabIdentSize = (size: number): number => (tabIdentSize.value = size);

  const lineHeight = useTypedLocalStorage(
    "EDITOR_LINE_HEIGHT",
    Constants.EDITOR_DEFAULT_LINE_HEIGHT
  );
  const setLineHeight = (size: number): number => (lineHeight.value = size);

  const reset = (): void => {
    setFontSize(Constants.EDITOR_DEFAULT_FONT_SIZE);
    setTabIdentSize(Constants.EDITOR_DEFAULT_TAB_IDENT_SIZE);
    setLineHeight(Constants.EDITOR_DEFAULT_LINE_HEIGHT);
  };

  return {
    fontSize,
    setFontSize,
    tabIdentSize,
    setTabIdentSize,
    lineHeight,
    setLineHeight,
    reset,
  };
});
