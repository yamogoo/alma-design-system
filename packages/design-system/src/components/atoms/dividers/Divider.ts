import type {
  DividerMode,
  DividerSize,
  DividerTone,
  DividerVariant,
} from "@/adapters/atoms/divider";

import type {
  UIElementAlignment,
  UIElementOrientation,
  UIElementStylingModifiers,
  UIElementTypographyTag,
} from "@/typings";

export type DividerAlign = UIElementAlignment;

export interface DividerProps
  extends Partial<
    UIElementStylingModifiers<
      DividerVariant,
      DividerSize,
      DividerMode,
      DividerTone
    >
  > {
  as?: UIElementTypographyTag;
  orientation?: UIElementOrientation;
  align?: DividerAlign;
}
