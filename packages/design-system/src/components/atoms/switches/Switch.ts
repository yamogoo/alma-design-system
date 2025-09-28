import type {
  SwitchVariant,
  SwitchMode,
  SwitchSize,
  SkeletonTone,
} from "@/adapters";

import type { UIElementStylingModifiers } from "@/typings";

export interface SwitchProps
  extends Partial<
    UIElementStylingModifiers<
      SwitchVariant,
      SwitchSize,
      SwitchMode,
      SkeletonTone
    >
  > {
  label?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  useNative?: boolean;
}
