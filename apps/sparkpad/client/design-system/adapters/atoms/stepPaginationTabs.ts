import tokens from "@/tokens";

export type StepPaginationTabSize =
  keyof typeof tokens.atoms.stepPaginationTabs.default;
export const stepPaginationTabSizes = Object.keys(
  tokens.atoms.stepPaginationTabs.default
) as StepPaginationTabSize[];

export type StepPaginationTabMode =
  keyof typeof tokens.themes.light.atoms.stepPaginationTabs;
export const stepPaginationTabModes = Object.keys(
  tokens.themes.light.atoms.stepPaginationTabs
) as StepPaginationTabMode[];
