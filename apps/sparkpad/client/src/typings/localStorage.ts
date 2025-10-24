export enum LocalStorageKeys {
  "AUTH_TOKEN",
  "AUTH_USER",

  "LOCALE",

  // Editor Layout
  "IS_NAVIGATOR_SHOWN",
  "NAVIGATOR_WIDTH",

  "EDITOR_FONT_SIZE",
  "EDITOR_TAB_IDENT_SIZE",
  "EDITOR_LINE_HEIGHT",
}

export type LocalStorageKey = keyof typeof LocalStorageKeys;
