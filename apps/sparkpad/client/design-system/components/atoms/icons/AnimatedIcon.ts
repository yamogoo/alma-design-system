import { Vue3Lottie as LottieAnimation } from "vue3-lottie";

import type { UIElementUnionProps } from "@/typings";

import type { IconSize, IconMode, IconTone } from "@/adapters";

export interface AnimatedIconProps extends Partial<UIElementUnionProps> {
  size?: IconSize;
  mode?: IconMode;
  tone?: IconTone;
  animationData: typeof LottieAnimation.animationData;
  speed?: number;
  isActive: boolean;
  loop?: boolean;
}
