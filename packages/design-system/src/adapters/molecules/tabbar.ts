import tokens from "@/tokens";

export type TabbarVariant = keyof typeof tokens.components.molecules.tabbar;
export const tabbarVariants = Object.keys(
  tokens.components.molecules.tabbar
) as TabbarVariant[];

export type TabbarSize =
  keyof typeof tokens.components.molecules.tabbar.default;
export const tabbarSizes = Object.keys(
  tokens.components.molecules.tabbar.default
) as TabbarSize[];

export type TabbarMode =
  keyof typeof tokens.themes.light.components.molecules.tabbar;
export const tabbarModes = Object.keys(
  tokens.themes.light.components.molecules.tabbar
) as TabbarMode[];

export type TabbarTone =
  keyof typeof tokens.themes.light.components.molecules.tabbar.neutral;
export const tabbarTones = Object.keys(
  tokens.themes.light.components.molecules.tabbar.neutral
) as Array<TabbarTone>;
