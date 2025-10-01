import tokens from "@/tokens";

export type SheetColor =
  keyof typeof tokens.themes.light.components.molecules.sheet;
export const sheetColors = Object.keys(
  tokens.themes.light.components.molecules.sheet
) as SheetColor[];
