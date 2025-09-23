import tokens from "@/tokens";

export type SkeletonVariant = keyof typeof tokens.atoms.skeleton;
export const skeletonVariants = Object.keys(
  tokens.atoms.skeleton
) as SkeletonVariant[];

export type SkeletonSize = keyof typeof tokens.atoms.skeleton.default;
export const skeletonSizes = Object.keys(
  tokens.atoms.skeleton.default
) as SkeletonSize[];

export type SkeletonMode = keyof typeof tokens.themes.light.atoms.skeleton;
export const skeletonModes = Object.keys(
  tokens.themes.light.atoms.skeleton
) as SkeletonMode[];

export type SkeletonTone =
  keyof typeof tokens.themes.light.atoms.skeleton.neutral;
export const skeletonTones = Object.keys(
  tokens.themes.light.atoms.skeleton.neutral
) as SkeletonTone[];
