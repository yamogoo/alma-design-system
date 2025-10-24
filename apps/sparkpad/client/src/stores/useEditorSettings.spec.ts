import { Constants } from "@/constants";

import { useEditorSettings } from "./useEditorSettings";

describe("useEditorSettings", () => {
  test("should set fontSize", () => {
    const expectedFontSize = Constants.EDITOR_DEFAULT_FONT_SIZE + 2;

    const store = useEditorSettings();

    store.setFontSize(expectedFontSize);

    expect(store.fontSize).toBe(expectedFontSize);
  });

  test("should set tabIdentSize", () => {
    const expectedTabIdentSize = Constants.EDITOR_DEFAULT_TAB_IDENT_SIZE + 2;

    const store = useEditorSettings();

    store.setTabIdentSize(expectedTabIdentSize);

    expect(store.tabIdentSize).toBe(expectedTabIdentSize);
  });

  test("should set lineHeight", () => {
    const expectedLineHeight = Constants.EDITOR_DEFAULT_LINE_HEIGHT + 0.5;

    const store = useEditorSettings();

    store.setLineHeight(expectedLineHeight);

    expect(store.lineHeight).toBe(expectedLineHeight);
  });

  test("should reset store", () => {
    const store = useEditorSettings();

    store.setFontSize(Constants.EDITOR_DEFAULT_FONT_SIZE + 2);
    store.setTabIdentSize(Constants.EDITOR_DEFAULT_TAB_IDENT_SIZE + 2);
    store.setLineHeight(Constants.EDITOR_DEFAULT_LINE_HEIGHT + 2);
    store.reset();

    expect(store.fontSize).toBe(Constants.EDITOR_DEFAULT_FONT_SIZE);
    expect(store.tabIdentSize).toBe(Constants.EDITOR_DEFAULT_TAB_IDENT_SIZE);
    expect(store.lineHeight).toBe(Constants.EDITOR_DEFAULT_LINE_HEIGHT);
  });
});
