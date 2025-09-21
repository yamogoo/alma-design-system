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
  ButtonRequiredProps,
} from "@/components/atoms";

export interface ActionButtonProps extends ButtonRequiredProps {
  variant?: ButtonVariant;
  size: ButtonSize;
  mode: ButtonMode;
  tone: ButtonTone;
  label?: string;
  contentDirection?: ButtonContentDirection;
  iconName?: IconName;
  iconStyle?: IconStyle;
  iconWeight?: IconWeight;
  isDisabled?: boolean;
  stretch?: ButtonStretch;
}
