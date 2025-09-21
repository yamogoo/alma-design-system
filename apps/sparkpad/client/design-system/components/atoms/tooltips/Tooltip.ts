import type { UIElementAlignment } from "@/typings";

import type { CharTooltipLabelProps } from "@/components/atoms";

export type TooltipAlign = UIElementAlignment;

export interface TooltipProps extends Pick<CharTooltipLabelProps, "label"> {
  align?: TooltipAlign;
  tooltipId?: string;
  isFollowingCursor?: boolean;
}
