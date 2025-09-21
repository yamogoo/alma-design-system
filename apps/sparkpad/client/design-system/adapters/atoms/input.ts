import tokens from "@/tokens";

export type InputVariant = keyof typeof tokens.atoms.input;
export const inputVariants = Object.keys(tokens.atoms.input) as InputVariant[];

export type InputSize = keyof typeof tokens.atoms.input.default;
export const inputSizes = Object.keys(
  tokens.atoms.input.default
) as InputSize[];

export type InputMode = keyof typeof tokens.themes.light.atoms.input;
export const inputModes = Object.keys(
  tokens.themes.light.atoms.input
) as InputMode[];

export type InputTone = keyof typeof tokens.themes.light.atoms.input.neutral;
export const inputTones = Object.keys(
  tokens.themes.light.atoms.input.neutral
) as InputTone[];
