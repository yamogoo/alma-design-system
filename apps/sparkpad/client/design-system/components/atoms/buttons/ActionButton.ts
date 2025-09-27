import type {
  ButtonMode,
  ButtonSize,
  ButtonTone,
  ButtonVariant,
} from "@/adapters";

import type {
  IconName,
  IconStyle,
  IconWeight,
  ButtonContentDirection,
  ButtonStretch,
} from "@/components/atoms";

import type { UIElementStylingModifiers } from "@/typings";

export interface ActionButtonProps
  extends Partial<
    UIElementStylingModifiers<ButtonVariant, ButtonSize, ButtonMode, ButtonTone>
  > {
  label?: string;
  contentDirection?: ButtonContentDirection;
  iconName?: IconName;
  iconStyle?: IconStyle;
  iconWeight?: IconWeight;
  isDisabled?: boolean;
  stretch?: ButtonStretch;
}
