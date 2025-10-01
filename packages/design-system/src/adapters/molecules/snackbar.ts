import tokens from "@/tokens";

export type SnackbarVariant = keyof typeof tokens.components.molecules.snackbar;
export const snackbarVariants = Object.keys(
  tokens.components.molecules.snackbar
) as SnackbarVariant[];

export type SnackbarSize =
  keyof typeof tokens.components.molecules.snackbar.default;
export const snackbarSizes = Object.keys(
  tokens.components.molecules.snackbar.default
) as SnackbarSize[];

export type SnackbarMode =
  keyof typeof tokens.themes.light.components.molecules.snackbar;
export const snackbarModes = Object.keys(
  tokens.themes.light.components.molecules.snackbar
) as SnackbarMode[];

export type SnackbarTone =
  keyof typeof tokens.themes.light.components.molecules.snackbar.neutral;
export const snackbarTones = Object.keys(
  tokens.themes.light.components.molecules.snackbar.neutral
) as Array<SnackbarTone>;
