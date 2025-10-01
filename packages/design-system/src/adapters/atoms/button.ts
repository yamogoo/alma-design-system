import tokens from "@/tokens";

export type ButtonVariant = keyof typeof tokens.components.atoms.button;

export const buttonVariants = Object.keys(
  tokens.components.atoms.button
) as Array<ButtonVariant>;

export type ButtonSize = keyof typeof tokens.components.atoms.button.default;

export const buttonSizes = Object.keys(
  tokens.components.atoms.button.default
) as Array<ButtonSize>;

export type ButtonMode =
  keyof typeof tokens.themes.light.components.atoms.button;
export const buttonModes = Object.keys(
  tokens.themes.light.components.atoms.button
) as Array<ButtonMode>;

export type ButtonTone =
  keyof typeof tokens.themes.light.components.atoms.button.neutral;
export const buttonTones = Object.keys(
  tokens.themes.light.components.atoms.button.neutral
) as Array<ButtonTone>;
