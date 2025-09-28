import type { Props } from "vue3-resize-bounding";

import type {
  ResizeBoundingMode,
  ResizeBoundingSize,
  ResizeBoundingTone,
  ResizeBoundingVariant,
} from "@/adapters/atoms/resizeBounding";

import type { UIElementStylingModifiers } from "@/typings";

export const RESIZE_BOUNDING_PREFIX = "resize-bounding";
export const RESIZE_BOUNDING_PREFIX_WITH_DIVIDER = `${RESIZE_BOUNDING_PREFIX}__`;

export interface ResizeBoundingProps
  extends Partial<
      UIElementStylingModifiers<
        ResizeBoundingVariant,
        ResizeBoundingSize,
        ResizeBoundingMode,
        ResizeBoundingTone
      >
    >,
    Omit<Props, "styles" | "options"> {}
