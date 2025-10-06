import { Vue3Lottie as LottieAnimation } from "vue3-lottie";

import type { UIElementStylingModifiers } from "@/typings";

import type { IconSize, IconMode, IconTone, IconVariant } from "@/adapters";

export interface AnimatedIconProps
  extends Partial<
    UIElementStylingModifiers<IconVariant, IconSize, IconMode, IconTone>
  > {
  animationData: typeof LottieAnimation.animationData;
  speed?: number;
  isActive: boolean;
  loop?: boolean;
}
