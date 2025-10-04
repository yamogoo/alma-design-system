import type { GroupVariant, GroupSize } from "@/adapters/atoms/group";

import type {
  UIElementAlignment,
  UIElementAxisDirection,
  UIElementBlockTag,
  UIElementOrientation,
  UIElementStretch,
  UIElementStylingModifiers,
} from "@/typings";
import type { SurfaceMode, SurfaceTone } from "~/src/adapters/atoms/surface";

export type GroupOrientation = UIElementOrientation;
export type GroupDirection = UIElementAxisDirection;
export type GroupAlignment = UIElementAlignment;
export type GroupStretch = UIElementStretch;
export type GroupAsTag = UIElementBlockTag;

export interface GroupProps
  extends Partial<
    UIElementStylingModifiers<GroupVariant, GroupSize, SurfaceMode, SurfaceTone>
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
