import type {
  MainHeaderMode,
  MainHeaderSize,
  MainHeaderTone,
  MainHeaderVariant,
} from "@/adapters";

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
