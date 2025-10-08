import tokens from "@/tokens";

export type SheetVariant = keyof typeof tokens.components.molecules.sheet;
export const sheetVariants = Object.keys(
  tokens.components.molecules.sheet
) as SheetVariant[];

export type SheetSize = keyof typeof tokens.components.molecules.sheet.default;
export const sheetSizes = Object.keys(
  tokens.components.molecules.sheet.default
) as SheetSize[];

// export type SheetMode =
//   keyof typeof tokens.themes.light.components.atoms.sheet;
// export const sheetModes = Object.keys(
//   tokens.light.components.atoms.sheet
// ) as SheetMode[];

// export type SheetTone =
//   keyof typeof tokens.themes.light.components.atoms.sheet.neutral;
// export const sheetTones = Object.keys(
//   tokens.light.components.atoms.sheet.neutral
// ) as SheetTone[];
