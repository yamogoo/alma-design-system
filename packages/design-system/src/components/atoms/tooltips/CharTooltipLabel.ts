import { NAMESPACE } from "@/constants";

import type {
  CharTooltipLabelMode,
  CharTooltipLabelSize,
  CharTooltipLabelVariant,
  CharTooltipLabelTone,
} from "@/adapters/atoms/charTooltipLabel";

import type { IconSize } from "@/adapters/atoms/icon";

import type { UIElementStylingModifiers } from "@/typings";

import type {
  IconName,
  IconStyle,
  IconWeight,
} from "@/components/atoms/icons/Icon";

export interface CharTooltipLabelProps
  extends Partial<
    UIElementStylingModifiers<
      CharTooltipLabelVariant,
      CharTooltipLabelSize,
      CharTooltipLabelMode,
      CharTooltipLabelTone
    >
  > {
  label?: string;
  iconName?: IconName;
  iconStyle?: IconStyle;
  iconWeight?: IconWeight;
  iconSize?: IconSize;
}

export const CHAR_TOOLTIP_PREFIX = `${NAMESPACE}char-tooltip-label`;
