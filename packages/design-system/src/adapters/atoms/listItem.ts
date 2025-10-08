import tokens from "@/tokens";

export type ListItemVariant = keyof typeof tokens.components.atoms.listItem;
export const listItemVariants = Object.keys(
  tokens.components.atoms.listItem
) as ListItemVariant[];

export type ListItemSize =
  keyof typeof tokens.components.atoms.listItem.default;
export const listItemSizes = Object.keys(
  tokens.components.atoms.listItem.default
) as ListItemSize[];

export type ListItemMode =
  keyof typeof tokens.themes.light.components.atoms.listItem;
export const listItemModes = Object.keys(
  tokens.themes.light.components.atoms.listItem
) as ListItemMode[];

export type ListItemTone =
  keyof typeof tokens.themes.light.components.atoms.listItem.neutral;
export const listItemTone = Object.keys(
  tokens.themes.light.components.atoms.listItem.neutral
) as ListItemTone[];
