import tokens from "@/tokens";

export type SnackbarVariant = keyof typeof tokens.molecules.snackbar;
export const snackbarVariants = Object.keys(
  tokens.molecules.snackbar
) as SnackbarVariant[];

export type SnackbarSize = keyof typeof tokens.molecules.snackbar.default;
export const snackbarSizes = Object.keys(
  tokens.molecules.snackbar.default
) as SnackbarSize[];

export type SnackbarMode = keyof typeof tokens.themes.light.molecules.snackbar;
export const snackbarModes = Object.keys(
  tokens.themes.light.molecules.snackbar
) as SnackbarMode[];

export type SnackbarTone =
  keyof typeof tokens.themes.light.molecules.snackbar.neutral;
export const snackbarTones = Object.keys(
  tokens.themes.light.molecules.snackbar.neutral
) as Array<SnackbarTone>;
