import tokens from "@/tokens";

export type FormSize = keyof typeof tokens.molecules.form.default;
export const formSizes = Object.keys(
  tokens.molecules.form.default
) as FormSize[];

export type FormMode = keyof typeof tokens.themes.light.molecules.form;
export const formModes = Object.keys(
  tokens.themes.light.molecules.form
) as FormMode[];
