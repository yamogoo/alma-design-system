import type {
  FormWrapperMode,
  FormWrapperSize,
  FormWrapperTone,
  FormWrapperVariant,
} from "@/adapters";

import type { UIElementContentKey, UIElementStylingModifiers } from "@/typings";

export interface FormWrapperProps
  extends Partial<
    UIElementStylingModifiers<
      FormWrapperVariant,
      FormWrapperSize,
      FormWrapperMode,
      FormWrapperTone
    >
  > {
  bordered?: boolean;
  duration?: number;
  contentKey?: UIElementContentKey;
}
