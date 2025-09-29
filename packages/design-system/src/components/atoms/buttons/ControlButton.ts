import type {
  ButtonMode,
  ButtonSize,
  ButtonTone,
  ButtonVariant,
} from "@/adapters/atoms/button";

import type { ButtonProps } from "@/components/atoms/buttons/Button";

import type { IconComponentProps } from "@/components/atoms/icons/Icon";

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
    Partial<
      Pick<
        ButtonProps,
        "contentDirection" | "label" | "isDisabled" | "stretch" | "iconSize"
      >
    >,
    IconComponentProps {}
