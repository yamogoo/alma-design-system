import type {
  ButtonMode,
  ButtonSize,
  ButtonTone,
  ButtonVariant,
  IconSize,
} from "@/adapters";

import type {
  ButtonContentDirection,
  ButtonStretch,
  IconComponentProps,
} from "@/components/atoms";

import type { UIElementStylingModifiers } from "@/typings";

export interface ControlButtonProps
  extends Partial<
      UIElementStylingModifiers<
        ButtonVariant,
        ButtonSize,
        ButtonMode,
        ButtonTone
      >
    >,
    IconComponentProps {
  label?: string;
  iconSize?: IconSize;
  contentDirection?: ButtonContentDirection;
  isDisabled?: boolean;
  stretch?: ButtonStretch;
}
