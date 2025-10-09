import tokens from "@/tokens";
import {
  surfaceModes,
  surfaceTones,
  type SurfaceMode,
  type SurfaceTone,
} from "@/adapters/atoms/surface";

export type GroupVariant = keyof typeof tokens.components.molecules.group;
export const groupVariants = Object.keys(
  tokens.components.molecules.group
) as GroupVariant[];

export type GroupSize = keyof typeof tokens.components.molecules.group.default;
export const groupSizes = Object.keys(
  tokens.components.molecules.group.default
) as GroupSize[];

export type GroupMode = SurfaceMode;
export const groupModes = surfaceModes;

export type GroupTone = SurfaceTone;
export const groupTones = surfaceTones;
