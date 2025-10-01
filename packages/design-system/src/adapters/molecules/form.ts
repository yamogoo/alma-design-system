import tokens from "@/tokens";

export type FormVariant = keyof typeof tokens.components.molecules.form;
export const formVariants = Object.keys(
  tokens.components.molecules.form
) as FormVariant[];

export type FormSize = keyof typeof tokens.components.molecules.form.default;
export const formSizes = Object.keys(
  tokens.components.molecules.form.default
) as FormSize[];

export type FormMode =
  keyof typeof tokens.themes.light.components.molecules.form;
export const formModes = Object.keys(
  tokens.themes.light.components.molecules.form
) as FormMode[];

export type FormTone =
  keyof typeof tokens.themes.light.components.molecules.form.neutral;
export const formTones = Object.keys(
  tokens.themes.light.components.molecules.form.neutral
) as FormTone[];
