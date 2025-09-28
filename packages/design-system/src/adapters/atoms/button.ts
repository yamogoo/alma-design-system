import tokens from "@alma/tokens";

export type ButtonVariant = keyof typeof tokens.atoms.button;

export const buttonVariants = Object.keys(
  tokens.atoms.button
) as Array<ButtonVariant>;

export type ButtonSize = keyof typeof tokens.atoms.button.default;

export const buttonSizes = Object.keys(
  tokens.atoms.button.default
) as Array<ButtonSize>;

export type ButtonMode = keyof typeof tokens.themes.light.atoms.button;
export const buttonModes = Object.keys(
  tokens.themes.light.atoms.button
) as Array<ButtonMode>;

export type ButtonTone = keyof typeof tokens.themes.light.atoms.button.neutral;
export const buttonTones = Object.keys(
  tokens.themes.light.atoms.button.neutral
) as Array<ButtonTone>;
