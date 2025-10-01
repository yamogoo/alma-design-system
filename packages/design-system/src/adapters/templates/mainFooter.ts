import tokens from "@/tokens";

export type MainFooterVariant =
  keyof typeof tokens.components.templates.mainFooter;
export const MainFooterVariants = Object.keys(
  tokens.components.templates.mainFooter
) as Array<MainFooterVariant>;

export type MainFooterSize =
  keyof typeof tokens.components.templates.mainFooter.default;
export const MainFooterSizes = Object.keys(
  tokens.components.templates.mainFooter.default
) as Array<MainFooterSize>;

export type MainFooterTone =
  keyof typeof tokens.themes.light.components.templates.mainFooter;
export const MainFooterTones = Object.keys(
  tokens.themes.light.components.templates.mainFooter
) as Array<MainFooterTone>;

export type MainFooterMode =
  keyof typeof tokens.themes.light.components.templates.mainFooter.neutral;
export const MainFooterModes = Object.keys(
  tokens.themes.light.components.templates.mainFooter.neutral
) as Array<MainFooterMode>;
