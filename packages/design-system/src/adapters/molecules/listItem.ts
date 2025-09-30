import tokens from "@/tokens";

export type ListItemVariant = keyof typeof tokens.molecules.listItem;
export const listItemVariants = Object.keys(
  tokens.molecules.listItem
) as ListItemVariant[];

export type ListItemSize = keyof typeof tokens.molecules.listItem.default;
export const listItemSizes = Object.keys(
  tokens.molecules.listItem.default
) as ListItemSize[];

export type ListItemMode = keyof typeof tokens.themes.dark.molecules.listItem;
export const listItemModes = Object.keys(
  tokens.themes.dark.molecules.listItem
) as ListItemMode[];

export type ListItemTone =
  keyof typeof tokens.themes.dark.molecules.listItem.neutral;
export const listItemTone = Object.keys(
  tokens.themes.dark.molecules.listItem.neutral
) as ListItemTone[];
