import { NAMESPACE } from "@/constants";

import type { GroupVariant, GroupSize } from "@/adapters/molecules/group";

import type {
  UIElementAlignmentProps,
  UIElementAxisDirection,
  UIElementBlockTag,
  UIElementBorderedProps,
  UIElementDirectionProps,
  UIElementDividerProps,
  UIElementMarginProps,
  UIElementOrientation,
  UIElementOrientationProps,
  UIElementPaddingProps,
  UIElementRoundedProps,
  UIElementStretch,
  UIElementStretchProps,
  UIElementStylingModifiers,
  UIElementWrapProps,
} from "@/typings";
import type { SurfaceMode, SurfaceTone } from "@/adapters/atoms/surface";

export type GroupOrientation = UIElementOrientation;
export type GroupDirection = UIElementAxisDirection;
export type GroupStretch = UIElementStretch;
export type GroupAsTag = UIElementBlockTag;

export interface GroupProps
  extends Partial<
      UIElementStylingModifiers<
        GroupVariant,
        GroupSize,
        SurfaceMode,
        SurfaceTone
      >
    >,
    UIElementAlignmentProps,
    UIElementDirectionProps,
    UIElementOrientationProps,
    UIElementStretchProps,
    UIElementWrapProps,
    UIElementBorderedProps,
    UIElementDividerProps,
    UIElementPaddingProps,
    UIElementMarginProps,
    UIElementRoundedProps {
  as?: GroupAsTag;
  role?: string;
  ariaLabel?: string;
}

export const GROUP_PREFIX = `${NAMESPACE}group`;
