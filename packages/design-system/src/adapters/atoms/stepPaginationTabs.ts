import tokens from "@/tokens";

export type StepPaginationTabSize =
  keyof typeof tokens.components.atoms.stepPaginationTabs.default;
export const stepPaginationTabSizes = Object.keys(
  tokens.components.atoms.stepPaginationTabs.default
) as StepPaginationTabSize[];

export type StepPaginationTabMode =
  keyof typeof tokens.themes.light.components.atoms.stepPaginationTabs;
export const stepPaginationTabModes = Object.keys(
  tokens.themes.light.components.atoms.stepPaginationTabs
) as StepPaginationTabMode[];
