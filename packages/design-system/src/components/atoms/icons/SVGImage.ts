import { NAMESPACE } from "@/constants";

import type {
  IconMode,
  IconSize,
  IconTone,
  IconVariant,
} from "@/adapters/atoms/icon";

import type { UIElementBooleanish, UIElementStylingModifiers } from "@/typings";

export interface SVGImageProps
  extends Partial<
    UIElementStylingModifiers<IconVariant, IconSize, IconMode, IconTone>
  > {
  name: string;
  ariaLabel?: string;
  ariaHidden?: UIElementBooleanish | undefined;
}

export const SVG_IMAGE_PREFIX = `${NAMESPACE}svg-image`;
