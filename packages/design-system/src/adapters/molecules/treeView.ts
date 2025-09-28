import tokens from "@/tokens";

export type TreeViewVariant = keyof typeof tokens.molecules.treeView;
export const treeViewVariants = Object.keys(
  tokens.molecules.treeView
) as TreeViewVariant[];

export type TreeViewSize = keyof typeof tokens.molecules.treeView.default;
export const treeViewSizes = Object.keys(
  tokens.molecules.treeView.default
) as TreeViewSize[];

export type TreeViewMode = keyof typeof tokens.themes.light.molecules.treeView;
export const treeViewModes = Object.keys(
  tokens.themes.light.molecules.treeView
) as TreeViewMode[];

export type TreeViewTone =
  keyof typeof tokens.themes.light.molecules.treeView.neutral;
export const treeViewTones = Object.keys(
  tokens.themes.light.molecules.treeView.neutral
) as Array<TreeViewTone>;
