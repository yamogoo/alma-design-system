import tokens from "@/tokens";

export type SidebarVariant = keyof typeof tokens.components.molecules.sidebar;
export const sidebarVariants = Object.keys(
  tokens.components.molecules.sidebar
) as SidebarVariant[];

export type SidebarSize =
  keyof typeof tokens.components.molecules.sidebar.default;
export const sidebarSizes = Object.keys(
  tokens.components.molecules.sidebar.default
) as SidebarSize[];

export type SidebarMode =
  keyof typeof tokens.themes.light.components.molecules.sidebar;
export const sidebarModes = Object.keys(
  tokens.light.components.molecules.sidebar
) as SidebarMode[];

export type SidebarTone =
  keyof typeof tokens.themes.light.components.molecules.sidebar.neutral;
export const sidebarTones = Object.keys(
  tokens.light.components.molecules.sidebar.neutral
) as SidebarTone[];
