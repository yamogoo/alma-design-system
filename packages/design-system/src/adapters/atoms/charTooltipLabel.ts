import tokens from "@/tokens";

export type CharTooltipLabelVariant =
  keyof typeof tokens.atoms.charTooltipLabel;
export const charTooltipLabelVariants = Object.keys(
  tokens.atoms.charTooltipLabel
) as CharTooltipLabelVariant[];

export type CharTooltipLabelSize =
  keyof typeof tokens.atoms.charTooltipLabel.default;
export const charTooltipLabelSizes = Object.keys(
  typeof tokens.atoms.charTooltipLabel.default
) as CharTooltipLabelSize[];

export type CharTooltipLabelMode =
  keyof typeof tokens.themes.light.atoms.charTooltipLabel;
export const charTooltipLabelModes = Object.keys(
  tokens.themes.light.atoms.charTooltipLabel
) as CharTooltipLabelMode[];

export type CharTooltipLabelTone =
  keyof typeof tokens.themes.light.atoms.charTooltipLabel.neutral;
export const charTooltipLabelTones = Object.keys(
  tokens.themes.light.atoms.charTooltipLabel.neutral
) as CharTooltipLabelTone[];
