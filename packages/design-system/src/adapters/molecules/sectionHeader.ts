import tokens from "@/tokens";

export type SectionHeaderVariant =
  keyof typeof tokens.components.molecules.sectionHeader;
export const sectionHeaderVariants = Object.keys(
  tokens.components.molecules.sectionHeader
) as SectionHeaderVariant[];

export type SectionHeaderSize =
  keyof typeof tokens.components.molecules.sectionHeader.default;
export const sectionHeaderSizes = Object.keys(
  tokens.components.molecules.sectionHeader.default
) as SectionHeaderSize[];

export type SectionHeaderMode =
  keyof typeof tokens.themes.light.components.molecules.sectionHeader;
export const sectionHeaderModes = Object.keys(
  tokens.themes.light.components.molecules.sectionHeader
) as SectionHeaderMode[];

export type SectionHeaderTone =
  keyof typeof tokens.themes.light.components.molecules.sectionHeader.neutral;
export const sectionHeaderTones = Object.keys(
  tokens.themes.light.components.molecules.sectionHeader.neutral
) as SectionHeaderTone[];
