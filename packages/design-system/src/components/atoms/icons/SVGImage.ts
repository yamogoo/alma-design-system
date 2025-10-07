import type {
  IconMode,
  IconSize,
  IconTone,
  IconVariant,
} from "@/adapters/atoms/icon";

import type { UIElementStylingModifiers } from "@/typings";

export interface SVGImageProps
  extends Partial<
    UIElementStylingModifiers<IconVariant, IconSize, IconMode, IconTone>
  > {
  name: string;
}
