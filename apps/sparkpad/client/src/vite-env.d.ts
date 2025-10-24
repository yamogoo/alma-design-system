/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv {
  /* * * Package.json * * */
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_AUTHOR_NAME: string;
  readonly APP_AUTHOR_FULL_NAME: string;
  readonly APP_AUTHOR_EMAIL: string;
  readonly APP_AUTHOR_URL: string;
  readonly VITE_APP_DEVICE_ID: string;

  /* * * Design Sytem config * * */
  readonly VITE_UI_LOCAL_THEME: string;
  readonly VITE_IS_SYSTEM_THEME_ENABLE: string;
  readonly VITE_APP_DEFAULT_LOCALE: string;

  /* * * Logger * * */
  readonly VITE_LOG_ENDPOINT: string;

  // === App config === /
  /* * * Environment Variables * * */
  readonly VITE_API_URL: string;

  /* * * Editor Layout * * */
  readonly VITE_DEFAULT_IS_NAVIGATOR_SHOWN: string;
  readonly VITE_DEFAULT_NAVIGATOR_WIDTH: string;
  readonly VITE_DEFAULT_NAVIGATOR_MIN_WIDTH: string;
  readonly VITE_DEFAULT_NAVIGATOR_MAX_WIDTH: string;

  readonly VITE_EDITOR_DEFAULT_FONT_SIZE: string;
  readonly VITE_EDITOR_FONT_MIN_SIZE: string;
  readonly VITE_EDITOR_FONT_MAX_SIZE: string;

  readonly VITE_EDITOR_DEFAULT_TAB_IDENT_SIZE: string;
  readonly VITE_EDITOR_MIN_TAB_IDENT_SIZE: string;
  readonly VITE_EDITOR_MAX_TAB_IDENT_SIZE: string;

  readonly VITE_EDITOR_DEFAULT_LINE_HEIGHT: string;
  readonly VITE_EDITOR_MIN_LINE_HEIGHT: string;
  readonly VITE_EDITOR_MAX_LINE_HEIGHT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
