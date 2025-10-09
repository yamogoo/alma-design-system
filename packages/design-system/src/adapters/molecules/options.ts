import tokens from "@/tokens";

export type OptionsVariant = keyof typeof tokens.components.molecules.options;
export const optionsVariants = Object.keys(
  tokens.components.molecules.options
) as OptionsVariant[];

export type OptionsSize =
  keyof typeof tokens.components.molecules.options.default;
export const optionsSizes = Object.keys(
  tokens.components.molecules.options.default
) as OptionsSize[];

export type OptionsMode =
  keyof typeof tokens.themes.light.components.molecules.options;
export const optionsModes = Object.keys(
  tokens.themes.light.components.molecules.options
) as OptionsMode[];

export type OptionsTone =
  keyof typeof tokens.themes.light.components.molecules.options.neutral;
export const optionsTones = Object.keys(
  tokens.themes.light.components.molecules.options.neutral
) as OptionsTone[];
