import tokens from "@alma/tokens";

export type MainFooterVariant = keyof typeof tokens.templates.mainFooter;
export const MainFooterVariants = Object.keys(
  tokens.templates.mainFooter
) as Array<MainFooterVariant>;

export type MainFooterSize = keyof typeof tokens.templates.mainFooter.default;
export const MainFooterSizes = Object.keys(
  tokens.templates.mainFooter.default
) as Array<MainFooterSize>;

export type MainFooterTone =
  keyof typeof tokens.themes.light.templates.mainFooter;
export const MainFooterTones = Object.keys(
  tokens.themes.light.templates.mainFooter
) as Array<MainFooterTone>;

export type MainFooterMode =
  keyof typeof tokens.themes.light.templates.mainFooter.neutral;
export const MainFooterModes = Object.keys(
  tokens.themes.light.templates.mainFooter.neutral
) as Array<MainFooterMode>;
