import type {
  ButtonMode,
  ButtonSize,
  ButtonTone,
  ButtonVariant,
} from "@/adapters";

import type {
  ButtonContentDirection,
  ButtonStretch,
  ButtonRequiredProps,
  IconComponentProps,
} from "@/components/atoms";

export interface ControlButtonProps
  extends ButtonRequiredProps,
    IconComponentProps {
  variant?: ButtonVariant;
  size: ButtonSize;
  mode: ButtonMode;
  tone: ButtonTone;
  label?: string;
  contentDirection?: ButtonContentDirection;
  isDisabled?: boolean;
  stretch?: ButtonStretch;
}
