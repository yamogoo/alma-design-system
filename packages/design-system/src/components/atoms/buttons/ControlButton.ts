import type {
  ButtonMode,
  ButtonSize,
  ButtonTone,
  ButtonVariant,
} from "@/adapters/atoms/button";

import type { UIElementStylingModifiers } from "@/typings";

import type { ButtonProps } from "./Button";

import type { IconComponentProps } from "@/components/atoms/icons/Icon";

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
    Omit<IconComponentProps, "iconSize"> {}
