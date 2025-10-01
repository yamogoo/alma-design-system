import tokens from "@/tokens";

export type SimpleMenuVariant = keyof typeof tokens.components.atoms.simpleMenu;
export const simpleMenuVariants = Object.keys(
  tokens.components.atoms.simpleMenu
) as SimpleMenuVariant[];

export type SimpleMenuSize =
  keyof typeof tokens.components.atoms.simpleMenu.default;
export const simpleMenuSizes = Object.keys(
  tokens.components.atoms.simpleMenu.default
) as SimpleMenuSize[];

// export type SimpleMenuMode = keyof typeof tokens.themes.light.components.atoms.simpleMenu;
// export const groupModes = Object.keys(
//   tokens.light.components.atoms.simpleMenu
// ) as SimpleMenuMode[];
