import tokens from "@/tokens";

export type FormWrapperVariant =
  keyof typeof tokens.components.molecules.formWrapper;
export const formWrapperVariants = Object.keys(
  tokens.components.molecules.formWrapper
) as FormWrapperVariant[];

export type FormWrapperSize =
  keyof typeof tokens.components.molecules.formWrapper.default;
export const formWrapperSizes = Object.keys(
  tokens.components.molecules.formWrapper.default
) as FormWrapperSize[];

export type FormWrapperMode =
  keyof typeof tokens.themes.light.components.molecules.formWrapper;
export const formWrapperModes = Object.keys(
  tokens.themes.light.components.molecules.formWrapper
) as FormWrapperMode[];

export type FormWrapperTone =
  keyof typeof tokens.themes.light.components.molecules.formWrapper.neutral;
export const formWrapperTones = Object.keys(
  tokens.themes.light.components.molecules.formWrapper.neutral
) as FormWrapperTone[];
