import tokens from "@/tokens";

export type InputVariant = keyof typeof tokens.components.atoms.input;
export const inputVariants = Object.keys(
  tokens.components.atoms.input
) as InputVariant[];

export type InputSize = keyof typeof tokens.components.atoms.input.default;
export const inputSizes = Object.keys(
  tokens.components.atoms.input.default
) as InputSize[];

export type InputMode = keyof typeof tokens.themes.light.components.atoms.input;
export const inputModes = Object.keys(
  tokens.themes.light.components.atoms.input
) as InputMode[];

export type InputTone =
  keyof typeof tokens.themes.light.components.atoms.input.neutral;
export const inputTones = Object.keys(
  tokens.themes.light.components.atoms.input.neutral
) as InputTone[];
