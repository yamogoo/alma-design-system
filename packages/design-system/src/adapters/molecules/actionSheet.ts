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
