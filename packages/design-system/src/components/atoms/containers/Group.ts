import type {
  GroupMode,
  GroupSize,
  GroupVariant,
  GroupTone,
} from "@/adapters/atoms/group";

import type {
  UIElementAlignment,
  UIElementAxisDirection,
  UIElementBlockTag,
  UIElementOrientation,
  UIElementStretch,
  UIElementStylingModifiers,
} from "@/typings";

export type GroupOrientation = UIElementOrientation;
export type GroupDirection = UIElementAxisDirection;
export type GroupAlignment = UIElementAlignment;
export type GroupStretch = UIElementStretch;
export type GroupAsTag = UIElementBlockTag;

export interface GroupProps
  extends Partial<
    UIElementStylingModifiers<GroupVariant, GroupSize, GroupMode, GroupTone>
  > {
  as?: GroupAsTag;
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
