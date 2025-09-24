import type {
  SliderMode,
  SliderSize,
  SliderTone,
  SliderVariant,
} from "@/adapters";

import type { UIElementAxisDirection, UIElementOrientation } from "@/typings";

export type SliderOrientation = UIElementOrientation;
export type SliderDirection = UIElementAxisDirection;

export interface SliderProps {
  variant?: SliderVariant;
  size?: SliderSize;
  mode?: SliderMode;
  tone?: SliderTone;
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
