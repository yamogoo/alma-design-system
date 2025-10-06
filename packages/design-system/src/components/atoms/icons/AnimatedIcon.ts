import { Vue3Lottie as LottieAnimation } from "vue3-lottie";

import type { UIElementStylingModifiers } from "@/typings";

import type {
  IconSize,
  IconMode,
  IconTone,
  IconVariant,
  IconState,
} from "@/adapters";

export interface AnimatedIconProps
  extends Partial<
    UIElementStylingModifiers<
      IconVariant,
      IconSize,
      IconMode,
      IconTone,
      IconState
    >
  > {
  animationData: typeof LottieAnimation.animationData;
  speed?: number;
  isActive: boolean;
  loop?: boolean;
}
