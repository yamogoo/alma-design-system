export enum LocalStorageKeys {
  "AUTH_TOKEN",
  "AUTH_USER",

  "LOCALE",

  // Editor Layout
  "IS_NAVIGATOR_SHOWN",
  "NAVIGATOR_WIDTH",
}

export type LocalStorageKey = keyof typeof LocalStorageKeys;
