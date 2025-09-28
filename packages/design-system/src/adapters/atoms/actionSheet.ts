import tokens from "@alma/tokens";

export type ActionSheetSize = keyof typeof tokens.atoms.actionSheet.default;
export const actionSheetSizes = Object.keys(
  tokens.atoms.actionSheet
) as ActionSheetSize[];

export type ActionSheetMode =
  keyof typeof tokens.themes.light.atoms.actionSheet;
export const actionSheetModes = Object.keys(
  tokens.themes.light.atoms.actionSheet
) as ActionSheetMode[];
