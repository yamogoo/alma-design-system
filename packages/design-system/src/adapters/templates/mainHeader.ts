import tokens from "@/tokens";

export type MainHeaderVariant =
  keyof typeof tokens.components.templates.mainHeader;
export const mainHeaderVariants = Object.keys(
  tokens.components.templates.mainHeader
) as Array<MainHeaderVariant>;

export type MainHeaderSize =
  keyof typeof tokens.components.templates.mainHeader.default;
export const mainHeaderSizes = Object.keys(
  tokens.components.templates.mainHeader.default
) as Array<MainHeaderSize>;

export type MainHeaderMode =
  keyof typeof tokens.themes.light.components.templates.mainHeader;
export const mainHeaderModes = Object.keys(
  tokens.themes.light.components.templates.mainHeader
) as Array<MainHeaderMode>;

export type MainHeaderTone =
  keyof typeof tokens.themes.light.components.templates.mainHeader.neutral;
export const mainHeaderTones = Object.keys(
  tokens.themes.light.components.templates.mainHeader.neutral
) as Array<MainHeaderTone>;
