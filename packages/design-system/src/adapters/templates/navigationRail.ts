import tokens from "@alma/tokens";

export type NavigationRailVariant =
  keyof typeof tokens.templates.navigationRail;
export const NavigationRailVariants = Object.keys(
  tokens.templates.navigationRail
) as Array<NavigationRailVariant>;

export type NavigationRailSize =
  keyof typeof tokens.templates.navigationRail.default;
export const NavigationRailSizes = Object.keys(
  tokens.templates.navigationRail.default
) as Array<NavigationRailSize>;

export type NavigationRailTone =
  keyof typeof tokens.themes.light.templates.navigationRail;
export const NavigationRailTones = Object.keys(
  tokens.themes.light.templates.navigationRail
) as Array<NavigationRailTone>;

export type NavigationRailMode =
  keyof typeof tokens.themes.light.templates.navigationRail.neutral;
export const NavigationRailModes = Object.keys(
  tokens.themes.light.templates.navigationRail.neutral
) as Array<NavigationRailMode>;
