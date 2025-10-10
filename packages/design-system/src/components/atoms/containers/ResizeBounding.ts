import { NAMESPACE } from "@/constants";

import type { Props } from "vue3-resize-bounding";

import type {
  ResizeBoundingMode,
  ResizeBoundingSize,
  ResizeBoundingTone,
  ResizeBoundingVariant,
} from "@/adapters/atoms/resizeBounding";

import type { UIElementStylingModifiers } from "@/typings";

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

export const SUFIX = "resize-bounding";
export const PREFIX_WITH_DIVIDER = `${NAMESPACE}${SUFIX}__`;
export const RESIZE_BOUNDING_PREFIX = `${NAMESPACE}${SUFIX}`;
