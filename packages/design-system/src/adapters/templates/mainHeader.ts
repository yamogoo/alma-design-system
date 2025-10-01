import tokens from "@/tokens";

export type MainHeaderVariant =
  keyof typeof tokens.components.templates.mainHeader;
export const MainHeaderVariants = Object.keys(
  tokens.components.templates.mainHeader
) as Array<MainHeaderVariant>;

export type MainHeaderSize =
  keyof typeof tokens.components.templates.mainHeader.default;
export const MainHeaderSizes = Object.keys(
  tokens.components.templates.mainHeader.default
) as Array<MainHeaderSize>;

export type MainHeaderTone =
  keyof typeof tokens.themes.light.components.templates.mainHeader;
export const MainHeaderTones = Object.keys(
  tokens.themes.light.components.templates.mainHeader
) as Array<MainHeaderTone>;

export type MainHeaderMode =
  keyof typeof tokens.themes.light.components.templates.mainHeader.neutral;
export const MainHeaderModes = Object.keys(
  tokens.themes.light.components.templates.mainHeader.neutral
) as Array<MainHeaderMode>;
