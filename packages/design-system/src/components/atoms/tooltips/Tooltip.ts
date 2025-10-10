import { NAMESPACE } from "@/constants";

import type { UIElementAlignment } from "@/typings";

import type { CharTooltipLabelProps } from "@/components/atoms/tooltips/CharTooltipLabel";

export type TooltipAlign = UIElementAlignment;

export interface TooltipProps extends Pick<CharTooltipLabelProps, "label"> {
  align?: TooltipAlign;
  tooltipId?: string;
  isFollowingCursor?: boolean;
}

export const TOOLTIP_PREFIX = `${NAMESPACE}tooltip`;
