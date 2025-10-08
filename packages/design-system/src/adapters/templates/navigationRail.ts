import tokens from "@/tokens";

export type NavigationRailVariant =
  keyof typeof tokens.components.templates.navigationRail;
export const navigationRailVariants = Object.keys(
  tokens.components.templates.navigationRail
) as Array<NavigationRailVariant>;

export type NavigationRailSize =
  keyof typeof tokens.components.templates.navigationRail.default;
export const navigationRailSizes = Object.keys(
  tokens.components.templates.navigationRail.default
) as Array<NavigationRailSize>;

export type NavigationRailMode =
  keyof typeof tokens.themes.light.components.templates.navigationRail;
export const navigationRailModes = Object.keys(
  tokens.themes.light.components.templates.navigationRail
) as Array<NavigationRailMode>;

export type NavigationRailTone =
  keyof typeof tokens.themes.light.components.templates.navigationRail.neutral;
export const navigationRailTones = Object.keys(
  tokens.themes.light.components.templates.navigationRail.neutral
) as Array<NavigationRailTone>;
