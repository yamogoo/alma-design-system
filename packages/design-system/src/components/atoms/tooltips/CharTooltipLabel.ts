import type {
  CharTooltipLabelMode,
  CharTooltipLabelSize,
  CharTooltipLabelVariant,
  CharTooltipLabelTone,
} from "@/adapters/atoms/charTooltipLabel";

import type { IconSize } from "@/adapters/atoms/icon";

import type { UIElementStylingModifiers } from "@/typings";

import type { IconName, IconStyle, IconWeight } from "@/components/atoms";

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
