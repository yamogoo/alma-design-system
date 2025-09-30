import tokens from "@/tokens";

export type ListVariant = keyof typeof tokens.molecules.list;
export const listVariants = Object.keys(tokens.molecules.list) as ListVariant[];

export type ListSize = keyof typeof tokens.molecules.list.default;
export const listSizes = Object.keys(
  tokens.molecules.list.default
) as ListSize[];

export type ListMode = keyof typeof tokens.themes.dark.molecules.list;
export const listModes = Object.keys(
  tokens.themes.dark.molecules.list
) as ListMode[];

export type ListTone = keyof typeof tokens.themes.dark.molecules.list.neutral;
export const listTone = Object.keys(
  tokens.themes.dark.molecules.list.neutral
) as ListTone[];
