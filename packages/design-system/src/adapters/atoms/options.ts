import tokens from "@/tokens";

export type OptionsVariant = keyof typeof tokens.components.atoms.options;
export const optionsVariants = Object.keys(
  tokens.components.atoms.options
) as OptionsVariant[];

export type OptionsSize = keyof typeof tokens.components.atoms.options.default;
export const optionsSizes = Object.keys(
  tokens.components.atoms.options.default
) as OptionsSize[];

export type OptionsMode =
  keyof typeof tokens.themes.light.components.atoms.options;
export const optionsModes = Object.keys(
  tokens.themes.light.components.atoms.options
) as OptionsMode[];

export type OptionsTone =
  keyof typeof tokens.themes.light.components.atoms.options.neutral;
export const optionsTone = Object.keys(
  tokens.themes.light.components.atoms.options.neutral
) as OptionsTone[];
