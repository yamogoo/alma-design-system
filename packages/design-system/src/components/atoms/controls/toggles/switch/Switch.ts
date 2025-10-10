import { NAME_SPACE } from "@/constants";

import type {
  SwitchVariant,
  SwitchMode,
  SwitchSize,
  SwitchTone,
} from "@/adapters/atoms/switch";

import type { UIElementStylingModifiers } from "@/typings";

export interface SwitchProps
  extends Partial<
    UIElementStylingModifiers<SwitchVariant, SwitchSize, SwitchMode, SwitchTone>
  > {
  label?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  useNative?: boolean;
}

export const SWITCH_PREFIX = `${NAME_SPACE}switch`;
