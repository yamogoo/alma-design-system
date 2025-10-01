import tokens from "@/tokens";

export type CharTooltipLabelVariant =
  keyof typeof tokens.components.atoms.charTooltipLabel;
export const charTooltipLabelVariants = Object.keys(
  tokens.components.atoms.charTooltipLabel
) as CharTooltipLabelVariant[];

export type CharTooltipLabelSize =
  keyof typeof tokens.components.atoms.charTooltipLabel.default;
export const charTooltipLabelSizes = Object.keys(
  tokens.components.atoms.charTooltipLabel.default
) as CharTooltipLabelSize[];

export type CharTooltipLabelMode =
  keyof typeof tokens.themes.light.components.atoms.charTooltipLabel;
export const charTooltipLabelModes = Object.keys(
  tokens.themes.light.components.atoms.charTooltipLabel
) as CharTooltipLabelMode[];

export type CharTooltipLabelTone =
  keyof typeof tokens.themes.light.components.atoms.charTooltipLabel.neutral;
export const charTooltipLabelTones = Object.keys(
  tokens.themes.light.components.atoms.charTooltipLabel.neutral
) as CharTooltipLabelTone[];
