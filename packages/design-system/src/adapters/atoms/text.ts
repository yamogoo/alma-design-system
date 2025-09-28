import tokens from "@alma/tokens";

export type TextVariant = keyof typeof tokens.typography.styles;
export const textVariants = Object.keys(
  tokens.typography.styles
) as TextVariant[];

export type TextMode = keyof typeof tokens.themes.light.abstracts.label;
export const textModes = Object.keys(
  tokens.themes.light.abstracts.label
) as TextMode[];

export type TextTone = keyof typeof tokens.themes.light.abstracts.label.neutral;
export const textTones = Object.keys(
  tokens.themes.light.abstracts.label.neutral
) as TextTone[];
