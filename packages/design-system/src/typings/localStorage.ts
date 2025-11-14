export enum LocalStorageKeys {
  "DISPLAY_SIZE",

  "VITE_APP_VERSION",

  "AUTH_TOKEN",
  "AUTH_USER",

  "THEME",
  "IS_SYSTEM_THEME_ENABLED",
  "IS_SYSTEM_PROTO_THEME_ENABLED",
}

export type LocalStorageKey = keyof typeof LocalStorageKeys;
