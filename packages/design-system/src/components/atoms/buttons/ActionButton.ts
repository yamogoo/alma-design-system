import type {
  ButtonMode,
  ButtonSize,
  ButtonTone,
  ButtonVariant,
} from "@/adapters/atoms/button";

import type {
  IconName,
  IconStyle,
  IconWeight,
} from "@/components/atoms/icons/Icon";

import type { ButtonProps } from "./Button";

import type { UIElementStylingModifiers } from "@/typings";

export interface ActionButtonProps
  extends Partial<
      UIElementStylingModifiers<
        ButtonVariant,
        ButtonSize,
        ButtonMode,
        ButtonTone
      >
    >,
    Partial<
      Pick<ButtonProps, "contentDirection" | "label" | "isDisabled" | "stretch">
    > {
  iconName?: IconName;
  iconStyle?: IconStyle;
  iconWeight?: IconWeight;
}
