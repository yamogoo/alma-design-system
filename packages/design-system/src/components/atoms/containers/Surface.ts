import type {
  SurfaceMode,
  SurfaceSize,
  SurfaceState,
  SurfaceTone,
  SurfaceVariant,
} from "@/adapters/atoms/surface";

import type { UIElementBlockTag, UIElementStylingModifiers } from "@/typings";

export interface SurfaceProps
  extends Partial<
    UIElementStylingModifiers<
      SurfaceVariant,
      SurfaceSize,
      SurfaceMode,
      SurfaceTone,
      SurfaceState
    >
  > {
  as?: UIElementBlockTag;
  isContainer?: boolean;
  bordered?: boolean;
  elevated?: boolean;
}
