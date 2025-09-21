import tokens from "@/tokens";

export type OptionsVariant = keyof typeof tokens.atoms.options;
export const optionsVariants = Object.keys(
  tokens.atoms.options
) as OptionsVariant[];

export type OptionsSize = keyof typeof tokens.atoms.options.default;
export const optionsSizes = Object.keys(
  tokens.atoms.options.default
) as OptionsSize[];

export type OptionsMode = keyof typeof tokens.themes.dark.atoms.options;
export const optionsModes = Object.keys(
  tokens.themes.dark.atoms.options
) as OptionsMode[];
