import type { FormWrapperMode, FormWrapperSize } from "@/adapters";

import type { UIElementContentKey, UIElementUnionProps } from "@/typings";

export interface FormWrapperProps extends Partial<UIElementUnionProps> {
  size?: FormWrapperSize;
  mode?: FormWrapperMode;
  bordered?: boolean;
  duration?: number;
  contentKey?: UIElementContentKey;
}
