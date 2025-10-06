import tokens from "@/tokens";

export type TextVariant = keyof typeof tokens.typography.styles;
export const textVariants = Object.keys(
  tokens.typography.styles
) as TextVariant[];

export type TextMode =
  keyof typeof tokens.themes.light.contracts.interactive.label;
export const textModes = Object.keys(
  tokens.themes.light.contracts.interactive.label
) as TextMode[];

export type TextTone =
  keyof typeof tokens.themes.light.contracts.interactive.label.neutral;
export const textTones = Object.keys(
  tokens.themes.light.contracts.interactive.label.neutral
) as TextTone[];

export type TextState =
  keyof typeof tokens.themes.light.contracts.interactive.label.neutral.primary;
export const textStates = Object.keys(
  tokens.themes.light.contracts.interactive.label.neutral.primary
) as TextState[];
