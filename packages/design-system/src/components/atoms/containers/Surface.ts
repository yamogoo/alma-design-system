import type {
  SurfaceMode,
  SurfaceSize,
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
      SurfaceTone
    >
  > {
  as?: UIElementBlockTag;
  isContainer?: boolean;
  bordered?: boolean;
  elevated?: boolean;
}
