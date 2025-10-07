import type {
  SurfaceMode,
  SurfaceSize,
  SurfaceTone,
  SurfaceVariant,
} from "@/adapters/atoms/surface";

import type { UIElementBlockTag, UIElementStylingModifiers } from "@/typings";
import {
  UIElementShortPositionAliases,
  UIElementShortPositions,
} from "@/typings";

export const SurfaceBorderPositions = UIElementShortPositions;
export const SurfaceBorderPositionAliases = UIElementShortPositionAliases;

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
  /** ltrb hv */
  borderSides?: string;
  elevated?: boolean;
  rounded?: boolean;
  divider?: string;
}
