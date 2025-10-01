import tokens from "@/tokens";

export type NavigationRailVariant =
  keyof typeof tokens.components.templates.navigationRail;
export const NavigationRailVariants = Object.keys(
  tokens.components.templates.navigationRail
) as Array<NavigationRailVariant>;

export type NavigationRailSize =
  keyof typeof tokens.components.templates.navigationRail.default;
export const NavigationRailSizes = Object.keys(
  tokens.components.templates.navigationRail.default
) as Array<NavigationRailSize>;

export type NavigationRailTone =
  keyof typeof tokens.themes.light.components.templates.navigationRail;
export const NavigationRailTones = Object.keys(
  tokens.themes.light.components.templates.navigationRail
) as Array<NavigationRailTone>;

export type NavigationRailMode =
  keyof typeof tokens.themes.light.components.templates.navigationRail.neutral;
export const NavigationRailModes = Object.keys(
  tokens.themes.light.components.templates.navigationRail.neutral
) as Array<NavigationRailMode>;
