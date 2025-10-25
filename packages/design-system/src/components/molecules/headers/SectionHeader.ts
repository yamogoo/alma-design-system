import { NAMESPACE } from "@/constants";

import type {
  SectionHeaderMode,
  SectionHeaderSize,
  SectionHeaderTone,
  SectionHeaderVariant,
} from "@/adapters";

import type {
  UIElementHeaderTag,
  UIElementStylingModifiers,
  UIElementTitleProps,
} from "@/typings";

export interface SectionHeaderProps
  extends Partial<
      UIElementStylingModifiers<
        SectionHeaderVariant,
        SectionHeaderSize,
        SectionHeaderMode,
        SectionHeaderTone
      >
    >,
    Partial<UIElementTitleProps> {
  as?: UIElementHeaderTag;
  isCloseButtonShown?: boolean;
  isActive?: boolean;
}

export const SECTION_HEADER_PREFIX = `${NAMESPACE}section-header`;
