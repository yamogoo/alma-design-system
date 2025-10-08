import tokens from "@/tokens";

export type StepPaginationTabVariant =
  keyof typeof tokens.components.atoms.stepPaginationTabs;
export const stepPaginationTabsVariants = Object.keys(
  tokens.components.atoms.stepPaginationTabs
) as StepPaginationTabVariant[];

export type StepPaginationTabSize =
  keyof typeof tokens.components.atoms.stepPaginationTabs.default;
export const stepPaginationTabsSizes = Object.keys(
  tokens.components.atoms.stepPaginationTabs.default
) as StepPaginationTabSize[];

export type StepPaginationTabMode =
  keyof typeof tokens.themes.light.components.atoms.stepPaginationTabs;
export const stepPaginationTabsModes = Object.keys(
  tokens.themes.light.components.atoms.stepPaginationTabs
) as StepPaginationTabMode[];

export type StepPaginationTabTone =
  keyof typeof tokens.themes.light.components.atoms.stepPaginationTabs.neutral;
export const stepPaginationTabsTones = Object.keys(
  tokens.themes.light.components.atoms.stepPaginationTabs.neutral
) as StepPaginationTabTone[];
