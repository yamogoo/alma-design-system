import tokens from "@/tokens";

export type DividerVariant = keyof typeof tokens.components.atoms.divider;
export const dividerVariants = Object.keys(
  tokens.components.atoms.divider
) as DividerVariant[];

export type DividerSize = keyof typeof tokens.components.atoms.divider.default;
export const dividerSizes = Object.keys(
  tokens.components.atoms.divider.default
) as DividerSize[];

export type DividerMode =
  keyof typeof tokens.themes.light.components.atoms.divider;
export const dividerModes = Object.keys(
  tokens.themes.light.components.atoms.divider
) as DividerMode[];

export type DividerTone =
  keyof typeof tokens.themes.light.components.atoms.divider.neutral;
export const dividerTones = Object.keys(
  tokens.themes.light.components.atoms.divider.neutral
) as DividerTone[];
