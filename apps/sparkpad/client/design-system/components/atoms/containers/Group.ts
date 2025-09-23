import type { GroupMode, GroupSize, GroupVariant, GroupTone } from "@/adapters";

import type {
  UIElementAlignment,
  UIElementAxisDirection,
  UIElementBlockTag,
  UIElementOrientation,
  UIElementStretch,
} from "@/typings";

export type GroupOrientation = UIElementOrientation;
export type GroupDirection = UIElementAxisDirection;
export type GroupAlignment = UIElementAlignment;
export type GroupStretch = UIElementStretch;
export type GroupAsTag = UIElementBlockTag;

export interface GroupProps {
  as?: GroupAsTag;
  variant?: GroupVariant;
  size?: GroupSize;
  mode?: GroupMode;
  tone?: GroupTone;
  orientation?: GroupOrientation;
  direction?: GroupDirection;
  verticalAlignment?: GroupAlignment;
  horizontalAlignment?: GroupAlignment;
  stretch?: GroupStretch;
  wrap?: boolean;
  divider?: boolean;
  gapX?: string;
  gapY?: string;
  role?: string;
  ariaLabel?: string;
}
