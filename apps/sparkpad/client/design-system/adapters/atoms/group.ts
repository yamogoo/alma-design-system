import tokens from "@/tokens";

export type GroupVariant = keyof typeof tokens.atoms.group;
export const groupVariants = Object.keys(tokens.atoms.group) as GroupVariant[];

export type GroupSize = keyof typeof tokens.atoms.group.default;
export const groupSizes = Object.keys(
  tokens.atoms.group.default
) as GroupSize[];

export type GroupMode = keyof typeof tokens.themes.light.atoms.group;
export const groupModes = Object.keys(
  tokens.themes.light.atoms.group
) as GroupMode[];
