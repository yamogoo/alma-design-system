import tokens from "@/tokens";

export type SkeletonVariant = keyof typeof tokens.components.atoms.skeleton;
export const skeletonVariants = Object.keys(
  tokens.components.atoms.skeleton
) as SkeletonVariant[];

export type SkeletonSize =
  keyof typeof tokens.components.atoms.skeleton.default;
export const skeletonSizes = Object.keys(
  tokens.components.atoms.skeleton.default
) as SkeletonSize[];

export type SkeletonMode =
  keyof typeof tokens.themes.light.components.atoms.skeleton;
export const skeletonModes = Object.keys(
  tokens.themes.light.components.atoms.skeleton
) as SkeletonMode[];

export type SkeletonTone =
  keyof typeof tokens.themes.light.components.atoms.skeleton.neutral;
export const skeletonTones = Object.keys(
  tokens.themes.light.components.atoms.skeleton.neutral
) as SkeletonTone[];
