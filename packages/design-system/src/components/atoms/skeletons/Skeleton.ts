import { NAME_SPACE } from "@/constants";

import type {
  SkeletonMode,
  SkeletonSize,
  SkeletonTone,
  SkeletonVariant,
} from "@/adapters/atoms/skeleton";

import type { UIElementStylingModifiers } from "@/typings";

export interface SkeletonProps
  extends Partial<
    UIElementStylingModifiers<
      SkeletonVariant,
      SkeletonSize,
      SkeletonMode,
      SkeletonTone
    >
  > {
  speed?: number;
}

export const SKELETON_PREFIX = `${NAME_SPACE}skeleton`;
