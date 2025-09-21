import tokens from "@/tokens";

export type SimpleMenuVariant = keyof typeof tokens.atoms.simpleMenu;
export const simpleMenuVariants = Object.keys(
  tokens.atoms.simpleMenu
) as SimpleMenuVariant[];

export type SimpleMenuSize = keyof typeof tokens.atoms.simpleMenu.default;
export const simpleMenuSizes = Object.keys(
  tokens.atoms.simpleMenu.default
) as SimpleMenuSize[];

// export type SimpleMenuMode = keyof typeof tokens.themes.light.atoms.simpleMenu;
// export const groupModes = Object.keys(
//   tokens.themes.light.atoms.simpleMenu
// ) as SimpleMenuMode[];
