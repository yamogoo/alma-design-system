import tokens from "@alma/tokens";

export type SheetColor = keyof typeof tokens.themes.light.atoms.sheet;
export const sheetColors = Object.keys(
  tokens.themes.light.atoms.sheet
) as SheetColor[];
