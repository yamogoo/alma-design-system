import tokens from "@/tokens";

export type ToolbarGroupVariant =
  keyof typeof tokens.components.molecules.toolbarGroup;
export const toolbarGroupVariants = Object.keys(
  tokens.components.molecules.toolbarGroup
) as ToolbarGroupVariant[];

export type ToolbarGroupSize =
  keyof typeof tokens.components.molecules.toolbarGroup.default;
export const toolbarGroupSizes = Object.keys(
  tokens.components.molecules.toolbarGroup.default
) as ToolbarGroupSize[];
