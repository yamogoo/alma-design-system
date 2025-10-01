import tokens from "@/tokens";

export type ActionSheetVariant =
  keyof typeof tokens.components.molecules.actionSheet;
export const actionSheetVariants = Object.keys(
  tokens.components.molecules.actionSheet
) as ActionSheetVariant[];

export type ActionSheetSize =
  keyof typeof tokens.components.molecules.actionSheet.default;
export const actionSheetSizes = Object.keys(
  tokens.components.molecules.actionSheet.default
) as ActionSheetSize[];

// export type ActionSheetMode =
//   keyof typeof tokens.themes.light.components.atoms.actionSheet;
// export const actionSheetModes = Object.keys(
//   tokens.light.components.atoms.actionSheet
// ) as ActionSheetMode[];

// export type ActionSheetTone =
//   keyof typeof tokens.themes.light.components.atoms.actionSheet.neutral;
// export const actionSheetTones = Object.keys(
//   tokens.light.components.atoms.actionSheet.neutral
// ) as ActionSheetTone[];
