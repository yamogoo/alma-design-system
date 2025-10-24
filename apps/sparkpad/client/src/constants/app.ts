import type { Typings } from "@alma/design-system";

export const APP_AUTHOR_NAME = import.meta.env.VITE_APP_AUTHOR_NAME || "";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "";
export const APP_AUTHOR_FULL_NAME = import.meta.env.APP_AUTHOR_FULL_NAME || "";
export const APP_AUTHOR_EMAIL = import.meta.env.APP_AUTHOR_EMAIL || "";
export const APP_AUTHOR_URL = import.meta.env.APP_AUTHOR_URL || "";

export const APP_DEVICE_ID = import.meta.env.VITE_APP_DEVICE_ID;

export const APP_DEFAULT_THEME =
  (import.meta.env.VITE_UI_LOCAL_THEME as Typings.Theme | undefined) ?? "dark";
