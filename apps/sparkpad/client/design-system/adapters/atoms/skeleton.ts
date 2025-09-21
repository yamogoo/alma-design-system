import tokens from "@/tokens";

export type SkeletonMode = keyof typeof tokens.themes.light.atoms.skeleton;
export const skeletonModes = Object.keys(
  tokens.themes.light.atoms.skeleton
) as SkeletonMode[];
