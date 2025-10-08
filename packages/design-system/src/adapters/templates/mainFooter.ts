import tokens from "@/tokens";

export type MainFooterVariant =
  keyof typeof tokens.components.templates.mainFooter;
export const mainFooterVariants = Object.keys(
  tokens.components.templates.mainFooter
) as Array<MainFooterVariant>;

export type MainFooterSize =
  keyof typeof tokens.components.templates.mainFooter.default;
export const mainFooterSizes = Object.keys(
  tokens.components.templates.mainFooter.default
) as Array<MainFooterSize>;

export type MainFooterMode =
  keyof typeof tokens.themes.light.components.templates.mainFooter;
export const mainFooterModes = Object.keys(
  tokens.themes.light.components.templates.mainFooter
) as Array<MainFooterMode>;

export type MainFooterTone =
  keyof typeof tokens.themes.light.components.templates.mainFooter.neutral;
export const mainFooterTones = Object.keys(
  tokens.themes.light.components.templates.mainFooter.neutral
) as Array<MainFooterTone>;
