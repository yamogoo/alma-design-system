import { NAMESPACE } from "@/constants";

import type {
  MainHeaderMode,
  MainHeaderSize,
  MainHeaderTone,
  MainHeaderVariant,
} from "@/adapters/templates/mainHeader";

import type { UIElementHeaderTag, UIElementStylingModifiers } from "@/typings";

export interface MainHeaderProps
  extends Partial<
    UIElementStylingModifiers<
      MainHeaderVariant,
      MainHeaderSize,
      MainHeaderMode,
      MainHeaderTone
    >
  > {
  as?: UIElementHeaderTag;
  isMainElement?: boolean;
}

export const MAIN_HEADER_PREFIX = `${NAMESPACE}main-header`;
