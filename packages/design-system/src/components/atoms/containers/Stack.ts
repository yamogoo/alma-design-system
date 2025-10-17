import { NAMESPACE } from "@/constants";

import type { AbstractBreakpoint } from "@/adapters/abstracts/breakpoints";
import type { StackSize, StackVariant } from "@/adapters/atoms/stack";

import {
  type UIElementAlignmentProps,
  type UIElementAxisDirection,
  type UIElementBlockTag,
  type UIElementBorderedProps,
  type UIElementDirectionProps,
  type UIElementDividerProps,
  type UIElementMarginProps,
  type UIElementOrientation,
  type UIElementOrientationProps,
  type UIElementPaddingProps,
  type UIElementRoundedProps,
  type UIElementStretch,
  type UIElementStretchProps,
  type UIElementStylingModifiers,
  type UIElementWrapProps,
} from "@/typings";

export type AbstractSpacing = AbstractBreakpoint;

export type StackOrientation = UIElementOrientation;
export type StackDirection = UIElementAxisDirection;
export type StackStretch = UIElementStretch;
export type StackAsTag = UIElementBlockTag;

export interface StackContainerProps
  extends UIElementAlignmentProps,
    UIElementDirectionProps,
    UIElementOrientationProps,
    UIElementStretchProps,
    UIElementWrapProps,
    UIElementBorderedProps,
    UIElementDividerProps,
    UIElementPaddingProps,
    UIElementMarginProps,
    UIElementRoundedProps {}

export interface StackStructureProps {
  isCloseButtonShown?: boolean;
}

export interface StackProps
  extends Partial<UIElementStylingModifiers<StackVariant, StackSize>>,
    StackContainerProps,
    StackStructureProps {
  as?: UIElementBlockTag;
  role?: string;
  ariaLabel?: string;
}

export const STACK_PREFIX = `${NAMESPACE}stack`;
