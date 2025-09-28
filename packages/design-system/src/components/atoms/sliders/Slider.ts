import type {
  SliderMode,
  SliderSize,
  SliderTone,
  SliderVariant,
} from "@/adapters";

import type {
  UIElementAxisDirection,
  UIElementOrientation,
  UIElementStylingModifiers,
} from "@/typings";

export type SliderOrientation = UIElementOrientation;
export type SliderDirection = UIElementAxisDirection;

export interface SliderProps
  extends Partial<
    UIElementStylingModifiers<SliderVariant, SliderSize, SliderMode, SliderTone>
  > {
  value: number;
  min?: number;
  max: number;
  step?: number;
  isSnapToStep?: boolean;
  snapThreshold?: number;
  isPageKeysEnabled?: boolean;
  isDisabled?: boolean;
  label?: string;
  /* * * animations * * */
  knobAnimScaleActive?: number;
  knobAnimScaleNormal?: number;
  knobAnimDuration?: number;
}
