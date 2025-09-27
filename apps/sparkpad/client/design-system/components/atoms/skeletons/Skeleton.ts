import type {
  SkeletonMode,
  SkeletonSize,
  SkeletonTone,
  SkeletonVariant,
} from "@/adapters";

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
  ariaLabel?: string;
  ariaBusy?: boolean;
}
