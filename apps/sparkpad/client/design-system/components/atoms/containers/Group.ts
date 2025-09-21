import type { GroupMode, GroupSize, GroupVariant } from "@/adapters";

import type {
  UIElementAlignment,
  UIElementAxisDirection,
  UIElementOrientation,
  UIElementStretch,
} from "@/typings";

export type GroupOrientation = UIElementOrientation;
export type GroupDirection = UIElementAxisDirection;
export type GroupAlignment = UIElementAlignment;
export type GroupStretch = UIElementStretch;
export type GroupAsTag = keyof HTMLElementTagNameMap;

export interface GroupProps {
  variant?: GroupVariant;
  size?: GroupSize;
  mode?: GroupMode;
  orientation?: GroupOrientation;
  direction?: GroupDirection;
  verticalAlignment?: GroupAlignment;
  horizontalAlignment?: GroupAlignment;
  stretch?: GroupStretch;
  wrap?: boolean;
  gapX?: string;
  gapY?: string;
  divider?: boolean;
  as?: GroupAsTag;
  role?: string;
  ariaLabel?: string;
}
