import tokens from "@/tokens";

export type ListVariant = keyof typeof tokens.components.molecules.list;
export const listVariants = Object.keys(
  tokens.components.molecules.list
) as ListVariant[];

export type ListSize = keyof typeof tokens.components.molecules.list.default;
export const listSizes = Object.keys(
  tokens.components.molecules.list.default
) as ListSize[];

export type ListMode =
  keyof typeof tokens.themes.light.components.molecules.list;
export const listModes = Object.keys(
  tokens.themes.light.components.molecules.list
) as ListMode[];

export type ListTone =
  keyof typeof tokens.themes.light.components.molecules.list.neutral;
export const listTone = Object.keys(
  tokens.themes.light.components.molecules.list.neutral
) as ListTone[];
