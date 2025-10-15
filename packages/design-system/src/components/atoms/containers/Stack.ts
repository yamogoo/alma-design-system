import { NAMESPACE } from "@/constants";

import type { AbstractBreakpoint } from "@/adapters/abstracts/breakpoints";
import type { StackSize, StackVariant } from "@/adapters/atoms/stack";

import {
  type UIElementAlignment,
  type UIElementAxisDirection,
  type UIElementBlockTag,
  type UIElementEdgeSpacing,
  type UIElementOrientation,
  type UIElementShortPosition,
  type UIElementShortPositionAlias,
  type UIElementStretch,
  type UIElementStylingModifiers,
} from "@/typings";

export type SurfaceStretch = UIElementStretch;

export type AbstractSpacing = AbstractBreakpoint;

export type StackOrientation = UIElementOrientation;
export type StackDirection = UIElementAxisDirection;
export type StackAlignment = UIElementAlignment;
export type StackStretch = UIElementStretch;
export type StackAsTag = UIElementBlockTag;

export interface StackProps
  extends Partial<UIElementStylingModifiers<StackVariant, StackSize>> {
  as?: UIElementBlockTag;
  orientation?: StackOrientation;
  direction?: StackDirection;
  verticalAlignment?: StackAlignment;
  horizontalAlignment?: StackAlignment;
  stretch?: StackStretch;
  wrap?: boolean;
  divider?: boolean;
  bordered?: boolean;
  padding?: Array<
    UIElementEdgeSpacing | UIElementShortPosition | UIElementShortPositionAlias
  >;
  margin?: Array<
    UIElementEdgeSpacing | UIElementShortPosition | UIElementShortPositionAlias
  >;
  gap?: Array<
    UIElementEdgeSpacing | UIElementShortPosition | UIElementShortPositionAlias
  >;
  role?: string;
  ariaLabel?: string;
}

export const STACK_PREFIX = `${NAMESPACE}stack`;
