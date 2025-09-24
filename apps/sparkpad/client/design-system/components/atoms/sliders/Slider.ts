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
  label?: string;
  orientation?: SliderOrientation;
}
