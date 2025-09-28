import tokens from "@alma/tokens";

export type IconMode = keyof typeof tokens.themes.light.abstracts.label;
export const iconModes = Object.keys(
  tokens.themes.light.abstracts.label
) as IconMode[];

export type IconTone = keyof typeof tokens.themes.light.abstracts.label.neutral;
export const iconTones = Object.keys(
  tokens.themes.light.abstracts.label.neutral
) as IconTone[];

export type IconSize = keyof typeof tokens.atoms.icon.default;
export const iconSizes = Object.keys(tokens.atoms.icon.default) as IconSize[];

export type IconVariant = keyof typeof tokens.atoms.icon;
export const iconVariants = Object.keys(tokens.atoms.icon) as IconVariant[];
