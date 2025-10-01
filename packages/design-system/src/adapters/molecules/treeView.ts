import tokens from "@/tokens";

export type TreeViewVariant = keyof typeof tokens.components.molecules.treeView;
export const treeViewVariants = Object.keys(
  tokens.components.molecules.treeView
) as TreeViewVariant[];

export type TreeViewSize =
  keyof typeof tokens.components.molecules.treeView.default;
export const treeViewSizes = Object.keys(
  tokens.components.molecules.treeView.default
) as TreeViewSize[];

export type TreeViewMode =
  keyof typeof tokens.themes.light.components.molecules.treeView;
export const treeViewModes = Object.keys(
  tokens.themes.light.components.molecules.treeView
) as TreeViewMode[];

export type TreeViewTone =
  keyof typeof tokens.themes.light.components.molecules.treeView.neutral;
export const treeViewTones = Object.keys(
  tokens.themes.light.components.molecules.treeView.neutral
) as Array<TreeViewTone>;
