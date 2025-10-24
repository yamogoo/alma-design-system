import tokenThemes from "@/tokens/output/themes.json";

import { type Theme } from "@/typings";

export const THEMES = Object.keys(tokenThemes) as Theme[];

export const DEFAULT_THEME =
  (import.meta.env.VITE_UI_LOCAL_THEME as Theme | undefined) ?? "dark";

export const APP_IS_SYSTEM_THEME_ENABLE =
  !!+import.meta.env.VITE_IS_SYSTEM_THEME_ENABLE || false;
export const APP_DEFAULT_LOCALE =
  import.meta.env.VITE_APP_DEFAULT_LOCALE || "en";
