import { NAMESPACE } from "@/constants";

import type {
  SurfaceMode,
  SurfaceSize,
  SurfaceTone,
  SurfaceVariant,
} from "@/adapters/atoms/surface";

import type {
  UIElementBlockTag,
  UIElementStretch,
  UIElementStylingModifiers,
} from "@/typings";
import {
  UIElementShortPositionAliases,
  UIElementShortPositions,
} from "@/typings";

export const SurfaceBorderPositions = UIElementShortPositions;
export const SurfaceBorderPositionAliases = UIElementShortPositionAliases;
export type SurfaceStretch = UIElementStretch;

export interface SurfaceProps
  extends Partial<
    UIElementStylingModifiers<
      SurfaceVariant,
      SurfaceSize,
      SurfaceMode,
      SurfaceTone
    >
  > {
  as?: UIElementBlockTag;
  isContainer?: boolean;
  stretch?: SurfaceStretch;
  /** ltrb hv */
  borderSides?: string;
  elevated?: boolean;
  rounded?: boolean;
  divider?: string;
}

export const SURFACE_PREFIX = `${NAMESPACE}surface`;
