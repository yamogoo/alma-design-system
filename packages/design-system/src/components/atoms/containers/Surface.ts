import { NAMESPACE } from "@/constants";

import type { SurfaceMode, SurfaceTone } from "@/adapters/atoms/surface";
import type { StackSize, StackVariant } from "@/adapters/atoms/stack";

import type {
  UIElementBlockTag,
  UIElementBorderProps,
  UIElementElevatedProps,
  UIElementStretch,
  UIElementStylingModifiers,
} from "@/typings";
import {
  UIElementShortPositionAliases,
  UIElementShortPositions,
} from "@/typings";
import type { StackContainerProps } from "./Stack";

export const SurfaceBorderPositions = UIElementShortPositions;
export const SurfaceBorderPositionAliases = UIElementShortPositionAliases;
export type SurfaceStretch = UIElementStretch;

export type LikeStackProps = StackContainerProps;

export interface SurfaceProps
  extends Partial<
      UIElementStylingModifiers<
        StackVariant,
        StackSize,
        SurfaceMode,
        SurfaceTone
      >
    >,
    LikeStackProps,
    UIElementElevatedProps,
    UIElementBorderProps {
  as?: UIElementBlockTag;
  isContainer?: boolean;
}

export const SURFACE_PREFIX = `${NAMESPACE}surface`;
