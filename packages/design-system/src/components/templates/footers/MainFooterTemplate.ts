import type {
  MainFooterMode,
  MainFooterSize,
  MainFooterTone,
  MainFooterVariant,
} from "@/adapters/templates/mainFooter";

import type { UIElementFooterTag, UIElementStylingModifiers } from "@/typings";

export interface MainFooterProps
  extends Partial<
    UIElementStylingModifiers<
      MainFooterVariant,
      MainFooterSize,
      MainFooterMode,
      MainFooterTone
    >
  > {
  as?: UIElementFooterTag;
}
