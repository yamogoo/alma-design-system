import tokens from "@/tokens";

export type IconVariant = keyof typeof tokens.components.atoms.icon;
export const iconVariants = Object.keys(
  tokens.components.atoms.icon
) as IconVariant[];

export type IconSize = keyof typeof tokens.components.atoms.icon.default;
export const iconSizes = Object.keys(
  tokens.components.atoms.icon.default
) as IconSize[];

export type IconMode =
  keyof typeof tokens.themes.light.contracts.interactive.label;
export const iconModes = Object.keys(
  tokens.themes.light.contracts.interactive.label
) as IconMode[];

export type IconTone =
  keyof typeof tokens.themes.light.contracts.interactive.label.neutral;
export const iconTones = Object.keys(
  tokens.themes.light.contracts.interactive.label.neutral
) as IconTone[];

export type IconState =
  keyof typeof tokens.themes.light.contracts.interactive.label.neutral.primary;
export const iconStates = Object.keys(
  tokens.themes.light.contracts.interactive.label.neutral.primary
) as IconTone[];
