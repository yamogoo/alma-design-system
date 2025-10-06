import type {
  IconMode,
  IconSize,
  IconState,
  IconTone,
  IconVariant,
} from "@/adapters";

import type { UIElementStylingModifiers } from "@/typings";

export interface SVGImageProps
  extends Partial<
    UIElementStylingModifiers<
      IconVariant,
      IconSize,
      IconMode,
      IconTone,
      IconState
    >
  > {
  name: string;
}
