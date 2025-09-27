import type { ControlWrapperSize, ControlWrapperVariant } from "@/adapters";

import type { UIElementStylingModifiers } from "@/typings";

export interface ControlWrapperProps
  extends Partial<
    Pick<
      UIElementStylingModifiers<ControlWrapperVariant, ControlWrapperSize>,
      "variant" | "size"
    >
  > {}
