import type { ControlWrapperSize, ControlWrapperVariant } from "@/adapters";

import type { UIElementStylingModifiers } from "@/typings";

export type ControlWrapperProps = Partial<
  Pick<
    UIElementStylingModifiers<ControlWrapperVariant, ControlWrapperSize>,
    "variant" | "size"
  >
>;
