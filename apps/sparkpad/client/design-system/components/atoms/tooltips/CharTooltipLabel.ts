import type {
  CharTooltipLabelMode,
  CharTooltipLabelSize,
  CharTooltipLabelVariant,
} from "@/adapters";

import type { IconName, IconStyle, IconWeight } from "@/components/atoms";

export interface CharTooltipLabelProps {
  variant?: CharTooltipLabelVariant;
  size?: CharTooltipLabelSize;
  mode?: CharTooltipLabelMode;
  label?: string;
  iconName?: IconName;
  iconStyle?: IconStyle;
  iconWeight?: IconWeight;
}
