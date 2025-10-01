import tokens from "@/tokens";

export type DropdownVariant = keyof typeof tokens.components.molecules.dropdown;
export const dropdownVariants = Object.keys(
  tokens.components.molecules.dropdown
) as DropdownVariant[];

export type DropdownSize =
  keyof typeof tokens.components.molecules.dropdown.default;
export const dropdownSizes = Object.keys(
  tokens.components.molecules.dropdown.default
) as DropdownSize[];

export type DropdownMode =
  keyof typeof tokens.themes.light.components.molecules.dropdown;
export const dropdownModes = Object.keys(
  tokens.themes.light.components.molecules.dropdown
) as DropdownMode[];

export type DropdownTone =
  keyof typeof tokens.themes.light.components.molecules.dropdown.neutral;
export const dropdownTone = Object.keys(
  tokens.themes.light.components.molecules.dropdown.neutral
) as DropdownTone[];
