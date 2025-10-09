import { NAME_SPACE } from "@/constants";

import type {
  ButtonMode,
  ButtonSize,
  ButtonTone,
  ButtonVariant,
} from "@/adapters/atoms/button";

import type { IconSize } from "@/adapters/atoms/icon";

import type {
  UIElementAxisDirection,
  UIElementStretch,
  UIElementStylingModifiers,
} from "@/typings";

import type { IconName, IconStyle, IconWeight } from "@/components/atoms/icons";

export type ButtonStretch = UIElementStretch;

export type ButtonContentDirection = UIElementAxisDirection;

export type ButtonRequiredProps = UIElementStylingModifiers<
  ButtonVariant,
  ButtonSize,
  ButtonMode,
  ButtonTone
>;

export interface ButtonProps extends Partial<ButtonRequiredProps> {
  as?: keyof HTMLElementTagNameMap;

  label?: string;
  contentDirection?: ButtonContentDirection;
  iconSize?: IconSize;
  prependIconName?: IconName;
  prependIconStyle?: IconStyle;
  prependIconWeight?: IconWeight;
  appendIconName?: IconName;
  appendIconStyle?: IconStyle;
  appendIconWeight?: IconWeight;
  scalePressed?: number;
  isDisabled?: boolean;
  stretch?: ButtonStretch;
  arialLabel?: string;
  bordered?: boolean;
}

export const PREFIX = `${NAME_SPACE}button`;
