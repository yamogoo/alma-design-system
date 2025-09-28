import tokens from "@alma/tokens";

export type DropdownVariant = keyof typeof tokens.molecules.dropdown;
export const dropdownVariants = Object.keys(
  tokens.molecules.dropdown
) as DropdownVariant[];

export type DropdownSize = keyof typeof tokens.molecules.dropdown.default;
export const dropdownSizes = Object.keys(
  tokens.molecules.dropdown.default
) as DropdownSize[];

export type DropdownMode = keyof typeof tokens.themes.light.molecules.dropdown;
export const dropdownModes = Object.keys(
  tokens.themes.light.molecules.dropdown
) as DropdownMode[];

export type DropdownTone =
  keyof typeof tokens.themes.light.molecules.dropdown.neutral;
export const dropdownTone = Object.keys(
  tokens.themes.light.molecules.dropdown.neutral
) as DropdownTone[];
