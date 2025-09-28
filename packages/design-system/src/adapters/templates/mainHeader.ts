import tokens from "@/tokens";

export type MainHeaderVariant = keyof typeof tokens.templates.mainHeader;
export const MainHeaderVariants = Object.keys(
  tokens.templates.mainHeader
) as Array<MainHeaderVariant>;

export type MainHeaderSize = keyof typeof tokens.templates.mainHeader.default;
export const MainHeaderSizes = Object.keys(
  tokens.templates.mainHeader.default
) as Array<MainHeaderSize>;

export type MainHeaderTone =
  keyof typeof tokens.themes.light.templates.mainHeader;
export const MainHeaderTones = Object.keys(
  tokens.themes.light.templates.mainHeader
) as Array<MainHeaderTone>;

export type MainHeaderMode =
  keyof typeof tokens.themes.light.templates.mainHeader.neutral;
export const MainHeaderModes = Object.keys(
  tokens.themes.light.templates.mainHeader.neutral
) as Array<MainHeaderMode>;
